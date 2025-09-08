from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import redis
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel
import time
from db import get_db
import json

app = FastAPI()
SECRET_KEY = "streamsyncsupersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
users_db = {}
class User(BaseModel):
    email: str
    hashed_password: str

class UserIn(BaseModel):
    email: str
    password: str

class ChatMessage(BaseModel):
    message: str
    timestamp: int

class Reaction(BaseModel):
    emoji: str
    timestamp: int

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: int = None):
    to_encode = data.copy()
    expire = time.time() + (expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(email: str, password: str):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=?", (email,))
    row = c.fetchone()
    conn.close()
    if not row:
        return False
    if not verify_password(password, row["hashed_password"]):
        return False
    return User(email=row["email"], hashed_password=row["hashed_password"])

@app.post("/signup")
async def signup(user: UserIn):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=?", (user.email,))
    if c.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    c.execute("INSERT INTO users (email, hashed_password) VALUES (?, ?)", (user.email, hashed_password))
    conn.commit()
    conn.close()
    return {"msg": "Signup successful"}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/chat")
async def post_chat(message: ChatMessage, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO chat (user_email, message, timestamp) VALUES (?, ?, ?)", (email, message.message, message.timestamp))
    conn.commit()
    conn.close()
    return {"msg": "Message stored"}

@app.get("/chat")
async def get_chat():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT user_email, message, timestamp FROM chat ORDER BY timestamp DESC LIMIT 50")
    messages = [dict(row) for row in c.fetchall()]
    conn.close()
    return messages

@app.post("/reaction")
async def post_reaction(reaction: Reaction, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO reactions (user_email, emoji, timestamp) VALUES (?, ?, ?)", (email, reaction.emoji, reaction.timestamp))
    conn.commit()
    conn.close()
    return {"msg": "Reaction stored"}

@app.get("/reaction")
async def get_reactions():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT user_email, emoji, timestamp FROM reactions ORDER BY timestamp DESC LIMIT 50")
    reactions = [dict(row) for row in c.fetchall()]
    conn.close()
    return reactions
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

connected_clients = []  # Store active WebSocket connections

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            event_type = message.get("event")
            
            if event_type == "chat":
                await broadcast({"event": "chat", "message": message["message"], "sender": message["sender"]})
            elif event_type == "reaction":
                await broadcast({"event": "reaction", "emoji": message["emoji"]})
            elif event_type == "sync":
                redis_client.set("global_timestamp", message["timestamp"])
                await broadcast({"event": "sync", "timestamp": message["timestamp"]})
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

async def broadcast(message: dict):
    for client in connected_clients:
        await client.send_text(json.dumps(message))

@app.get("/cdn-metrics")
async def get_cdn_metrics():
    # Simulated CDN data (Replace with real API call if needed)
    cdn_data = {
        "latency": 50,  # in ms
        "bandwidth": 120,  # in Mbps
        "cacheHitRatio": 85  # in %
    }
    return cdn_data

@app.get("/sync-timestamp")
async def get_sync_timestamp():
    timestamp = redis_client.get("global_timestamp")
    return {"timestamp": timestamp or 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
