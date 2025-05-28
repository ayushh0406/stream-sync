import { useState, useEffect } from 'react';

interface User {
  email: string;
  isOnline: boolean;
  joinedAt: number;
}

export const useUserStatus = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Simulate user status updates
    const interval = setInterval(() => {
      setOnlineCount(Math.floor(Math.random() * 50) + 10);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const removeUser = (email: string) => {
    setUsers(prev => prev.filter(u => u.email !== email));
  };

  const updateUserStatus = (email: string, isOnline: boolean) => {
    setUsers(prev => 
      prev.map(u => u.email === email ? { ...u, isOnline } : u)
    );
  };

  return {
    users,
    onlineCount,
    addUser,
    removeUser,
    updateUserStatus
  };
};