// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState('');

//   const fetchMessages = async () => {
//     const res = await axios.get('https://chatapp-backend-three-weld.vercel.app/api/messages');
//     setMessages(res.data.reverse());
//   };

//   const handleDump = async () => {
//     if (message.trim()) {
//       await axios.post('https://chatapp-backend-three-weld.vercel.app/api/messages', { text: message });
//       setMessage('');
//       fetchMessages();
//     }
//   };

//   const handleEdit = (id, currentText) => {
//     setEditingId(id);
//     setEditingText(currentText);
//   };

//   const handleSave = async () => {
//     if (editingText.trim()) {
//       await axios.put(`https://chatapp-backend-three-weld.vercel.app/api/messages/${editingId}`, {
//         text: editingText,
//       });
//       setEditingId(null);
//       setEditingText('');
//       fetchMessages();
//     }
//   };

//   const handleClearAll = async () => {
//     const confirmClear = window.confirm('Are you sure you want to delete ALL messages?');
//     if (confirmClear) {
//       await axios.delete('https://chatapp-backend-three-weld.vercel.app/api/messages');
//       fetchMessages();
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <header className="bg-white shadow p-4 text-center sticky top-0 z-10">
//         <h1 className="text-2xl font-bold">Notes App</h1>
//       </header>

//       <main className="flex-1 overflow-y-auto p-4">
//         {messages.length === 0 ? (
//           <p className="text-center text-gray-500">No notes yet.</p>
//         ) : (
//           <div className="space-y-3">
//             {messages.map((msg) => (
//               <div
//                 key={msg._id}
//                 className="bg-white rounded-lg p-3 shadow-md max-w-full mx-auto"
//               >
//                 {editingId === msg._id ? (
//                   <>
//                     <textarea
//                       className="w-full p-2 border rounded mb-2"
//                       rows="3"
//                       value={editingText}
//                       onChange={(e) => setEditingText(e.target.value)}
//                     />
//                     <button
//                       onClick={handleSave}
//                       className="bg-green-600 text-white px-3 py-1 rounded"
//                     >
//                       Save
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="whitespace-pre-wrap break-words">{msg.text}</div>
//                     <button
//                       onClick={() => handleEdit(msg._id, msg.text)}
//                       className="text-sm text-blue-600 mt-2"
//                     >
//                       ✏️ Edit
//                     </button>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       <footer className="bg-gray-200 shadow-xl p-4 sticky bottom-0 w-full">
//         <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//           <textarea
//             className="flex-1 p-2 border rounded resize-none"
//             rows="2"
//             placeholder="Type your notes..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <div className="flex gap-2">
//             <button
//               onClick={handleDump}
//               className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleClearAll}
//               className="bg-red-600 text-white px-4 py-2 rounded whitespace-nowrap"
//             >
//               Clear All
//             </button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;
// import React from 'react'
// import YoutubeComponent from './components/Youtube/YoutubeComponent'

// const App = () => {
//   return (
//     <div><YoutubeComponent /></div>
//   )
// }

// export default App


import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import YoutubeComponent from "./components/Youtube/YoutubeComponent";
import Roadmap from "./components/RoadMap/Roadmap";
import Home from "./components/Home";
import ProjectManager from "./components/Projects/ProjectManager";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#121212] text-white">
        {/* Navbar */}
        <nav className="bg-[#1f1f1f] p-4 shadow-md flex items-center justify-between">
          <h1 className="text-xl font-bold">📚 Tech Explorer</h1>
          <div className="flex space-x-6 text-sm">
            <Link to="/" className="hover:text-blue-400">Home</Link>
            <Link to="/articles" className="hover:text-blue-400">Research Article</Link>
            <Link to="/technologies" className="hover:text-blue-400">More About Technologies</Link>
            <Link to="/projects" className="hover:text-blue-400">📂 Projects</Link> {/* ✅ added */}
          </div>
        </nav>

        {/* Routes */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<YoutubeComponent />} />
            <Route path="/technologies" element={<Roadmap />} />
            <Route path="/projects" element={<ProjectManager />} /> {/* ✅ added */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;


