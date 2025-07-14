import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "https://chatapp-backend-three-weld.vercel.app/api/roadmap";

const Roadmap = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roadmaps, setRoadmaps] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // For accordion

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setRoadmaps(res.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const addRoadmap = async () => {
    if (!title || !description) return alert("Both fields required");

    try {
      await axios.post(`${baseUrl}/add`, { title, description });
      setTitle("");
      setDescription("");
      fetchAll();
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  const deleteById = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      fetchAll();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const deleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all roadmaps?"))
      return;
    try {
      await axios.delete(`${baseUrl}`);
      fetchAll();
    } catch (err) {
      console.error("Delete All Error:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 px-4 py-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center md:text-left">
          🧭 Roadmap Manager
        </h1>

        {/* Input Section */}
        <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-xl shadow-lg mb-10 border border-gray-700">
          <input
            type="text"
            placeholder="Enter roadmap title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Enter roadmap description (Shift + Enter for newline)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addRoadmap();
              }
            }}
            className="w-full h-32 p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none whitespace-pre-wrap"
          />

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={addRoadmap}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
              ➕ Add Roadmap
            </button>
            <button
              onClick={deleteAll}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
            >
              🗑 Delete All
            </button>
          </div>
        </div>

        {/* Accordion-style Roadmap List */}
        <div className="space-y-4">
          {roadmaps.length === 0 ? (
            <p className="text-gray-400 text-center">No roadmaps found.</p>
          ) : (
            roadmaps.map((roadmap) => {
              const isExpanded = expandedId === roadmap._id;
              return (
                <div
                  key={roadmap._id}
                  className="bg-[#1a1a1a] border border-gray-700 p-4 md:p-5 rounded-lg"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(roadmap._id)}
                  >
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      {roadmap.title}
                    </h2>
                    <span className="text-gray-400 text-sm">
                      {isExpanded ? "▲ Hide" : "▼ Show"}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-3">
                      <pre className="whitespace-pre-wrap text-gray-300">
                        {roadmap.description}
                      </pre>
                      <button
                        onClick={() => deleteById(roadmap._id)}
                        className="mt-2 text-sm text-red-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
