import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Mail, Check, Trash2 } from 'lucide-react';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await apiService.get('/api/messages');
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id: string, isRead: boolean) => {
    try {
      const res = await apiService.put(`/api/messages/${id}`, { isRead });
      if (res.ok) {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead } : m));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await apiService.delete(`/api/messages/${id}`);
      if (res.ok) {
         setMessages(prev => prev.filter(m => m._id !== id));
      }
    } catch (error) {
       console.error(error);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading messages...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <Mail size={24} className="text-primaryAction" /> Component Inbox
        </h1>
        <p className="text-sm text-gray-400 mt-1">Review contact inquiries and support requests.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.length === 0 ? (
          <div className="text-center p-12 bg-[#1a1a1a] rounded-xl border border-[#333] text-gray-500">
            No messages found.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`p-6 rounded-xl border ${msg.isRead ? 'bg-[#1a1a1a] border-[#333] opacity-70' : 'bg-[#222] border-primaryAction/30 shadow-[0_0_15px_rgba(231,29,54,0.1)]'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="font-bold text-gray-200">{msg.name}</h3>
                   <a href={`mailto:${msg.email}`} className="text-sm text-blue-400 hover:underline">{msg.email}</a>
                   <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => markRead(msg._id, !msg.isRead)} 
                     className={`p-2 rounded-lg text-xs font-bold transition-colors ${msg.isRead ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-primaryAction/20 hover:bg-primaryAction/40 text-primaryAction'}`}
                     title={msg.isRead ? "Mark Unread" : "Mark Read"}
                   >
                     <Check size={16} />
                   </button>
                   <button 
                     onClick={() => deleteMessage(msg._id)} 
                     className="p-2 rounded-lg bg-red-900/30 text-red-500 hover:bg-red-900/60"
                     title="Delete Message"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
