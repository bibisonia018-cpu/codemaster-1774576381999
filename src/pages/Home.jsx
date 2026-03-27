import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (user && room) {
      localStorage.setItem('chat_user', user);
      navigate(`/chat/${room}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0b0e11]">
      <div className="w-full max-w-md p-8 bg-[#15191c] rounded-2xl border border-gray-800 shadow-2xl">
        <h1 className="text-2xl font-bold text-[#00a884] text-center mb-6">الدردشة السرية 🛡️</h1>
        <form onSubmit={handleJoin} className="space-y-4">
          <input 
            type="text" 
            placeholder="اسمك المستعار" 
            className="w-full p-3 bg-black rounded-lg border border-gray-700 outline-none focus:border-[#00a884]"
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="كود الغرفة (الرقم السري)" 
            className="w-full p-3 bg-black rounded-lg border border-gray-700 outline-none focus:border-[#00a884]"
            onChange={(e) => setRoom(e.target.value)}
            required
          />
          <button className="w-full bg-[#00a884] text-black font-bold py-3 rounded-lg hover:bg-[#008f6f] transition">
            دخول الآن
          </button>
        </form>
      </div>
    </div>
  );
}