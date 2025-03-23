from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import redis
import json

app = FastAPI()
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
