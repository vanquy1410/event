"use client";

import { useEffect } from 'react';
import styles from './Chatbot.module.css';

const ChatbotScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    //script.src = `//code.tidio.co/${process.env.TIDIO_KEY}.js`; // Thay MA_CODE_CUA_BAN bằng mã script từ Tidio

    script.src = `//code.tidio.co/k0u8pjce4ezyv6s80nbxjzcgmcfva3xh.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="tidio-chat-container" />;
};

export default ChatbotScript;
// "use client"

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { FaRobot, FaTimes } from 'react-icons/fa';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
//   const [input, setInput] = useState('');

//   const handleSend = async () => {
//     if (input.trim() === '') return;

//     setMessages([...messages, { text: input, isBot: false }]);
//     setInput('');

//     try {
//       const response = await fetch('/api/chatbot', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: input }),
//       });

//       if (!response.ok) throw new Error('Lỗi khi gửi tin nhắn');

//       const data = await response.json();
//       setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
//     } catch (error) {
//       console.error('Lỗi:', error);
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {!isOpen && (
//         <Button onClick={() => setIsOpen(true)} className="rounded-full p-3">
//           <FaRobot size={24} />
//         </Button>
//       )}
//       {isOpen && (
//         <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
//           <div className="flex justify-between items-center p-3 border-b">
//             <h3 className="font-bold">Chatbot</h3>
//             <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
//               <FaTimes />
//             </Button>
//           </div>
//           <div className="flex-1 overflow-y-auto p-3">
//             {messages.map((msg, index) => (
//               <div key={index} className={`mb-2 ${msg.isBot ? 'text-left' : 'text-right'}`}>
//                 <span className={`inline-block p-2 rounded-lg ${msg.isBot ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
//                   {msg.text}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <div className="p-3 border-t flex">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//               placeholder="Nhập tin nhắn..."
//               className="flex-1 mr-2"
//             />
//             <Button onClick={handleSend}>Gửi</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
