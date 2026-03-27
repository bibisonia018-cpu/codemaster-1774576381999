import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, LogOut } from 'lucide-react';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef();
  const user = localStorage.getItem('chat_user');

  useEffect(() => {
    if (!user) return navigate('/');

    // جلب الرسائل في الوقت الفعلي (onSnapshot)
    const q = query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [roomId, user, navigate]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      sender: user,
      roomId: roomId,
      createdAt: serverTimestamp()
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e11] text-white">
      {/* Header */}
      <div className="p-4 bg-[#15191c] flex justify-between items-center border-b border-gray-800">
        <h2 className="font-bold">غرفة: <span className="text-[#00a884]">{roomId}</span></h2>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-red-500 transition"><LogOut size={20}/></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === user ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${m.sender === user ? 'bg-[#00a884] text-black rounded-tr-none' : 'bg-[#15191c] text-white rounded-tl-none border border-gray-800'}`}>
              <p className="text-[10px] font-bold opacity-60 mb-1">{m.sender}</p>
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-[#15191c] flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالة سرية..."
          className="flex-1 bg-black border border-gray-800 p-3 rounded-full outline-none focus:border-[#00a884]"
        />
        <button type="submit" className="bg-[#00a884] p-3 rounded-full text-black"><Send size={20}/></button>
      </form>
    </div>
  );
}