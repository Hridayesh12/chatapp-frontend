import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const API = "https://chatapp-backend-three-weld.vercel.app/api/projects"; // adjust this as needed

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [expandedFile, setExpandedFile] = useState(null);
  const [copiedFileId, setCopiedFileId] = useState(null);

  // Forms
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newFile, setNewFile] = useState({ filename: "", content: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/projects`);
    setProjects(res.data);
  };

  const openProject = async (project) => {
    const res = await axios.get(`${API}/projects/${project._id}`);
    setSelectedProject(res.data.project);
    setFiles(res.data.files);
    setExpandedFile(null);
    setNewFile({ filename: "", content: "" });
  };

  const goBack = () => {
    setSelectedProject(null);
    setFiles([]);
    setExpandedFile(null);
  };

  const handleCopy = async (text, fileId) => {
    await navigator.clipboard.writeText(text);
    setCopiedFileId(fileId);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  const createProject = async () => {
    if (!newProject.title.trim()) return;
    await axios.post(`${API}/projects`, newProject);
    setNewProject({ title: "", description: "" });
    fetchProjects();
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project and all files?")) return;
    await axios.delete(`${API}/projects/${id}`);
    fetchProjects();
    goBack();
  };

  const addFile = async () => {
    if (!newFile.filename.trim()) return;
    const res = await axios.post(
      `${API}/projects/${selectedProject._id}/files`,
      newFile
    );
    setFiles((prev) => [...prev, res.data]);
    setNewFile({ filename: "", content: "" });
  };

  const deleteFile = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    await axios.delete(`${API}/files/${fileId}`);
    setFiles((prev) => prev.filter((file) => file._id !== fileId));
  };

  const updateFileContent = async (fileId, newContent) => {
    const res = await axios.put(`${API}/files/${fileId}`, {
      content: newContent,
    });
    setFiles((prev) =>
      prev.map((file) => (file._id === fileId ? res.data : file))
    );
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6 font-mono">
      <h1 className="text-2xl font-bold mb-6">🗂 Code Projects Viewer</h1>

      {!selectedProject ? (
        <>
          <div className="bg-[#2a2a2a] p-4 rounded mb-6">
            <h2 className="text-lg font-semibold mb-2">
              ➕ Create New Project
            </h2>
            <input
              type="text"
              placeholder="Project Title"
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 bg-gray-800 rounded"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
            <button
              onClick={createProject}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
            >
              Create Project
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => openProject(project)}
                className="cursor-pointer bg-[#2a2a2a] hover:bg-[#333] p-4 rounded-lg shadow"
              >
                <h2 className="text-lg font-semibold">📁 {project.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {project.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div className="flex justify-between mb-4">
            <button
              onClick={goBack}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              🔙 Back to Projects
            </button>
            <button
              onClick={() => deleteProject(selectedProject._id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
            >
              🗑 Delete Project
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-3">
            📂 {selectedProject.title}
          </h2>

          {/* Add File Form */}
          <div className="bg-[#2a2a2a] p-4 rounded mb-6">
            <h3 className="text-lg font-semibold mb-2">📄 Add New File</h3>
            <input
              type="text"
              placeholder="Filename"
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={newFile.filename}
              onChange={(e) =>
                setNewFile({ ...newFile, filename: e.target.value })
              }
            />
            <textarea
              placeholder="Paste code here..."
              className="w-full p-2 bg-gray-800 rounded"
              rows={5}
              value={newFile.content}
              onChange={(e) =>
                setNewFile({ ...newFile, content: e.target.value })
              }
            />
            <button
              onClick={addFile}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
            >
              ➕ Add File
            </button>
          </div>

          {/* File List */}
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file._id}
                className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-600"
              >
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-700"
                  onClick={() =>
                    setExpandedFile(expandedFile === file._id ? null : file._id)
                  }
                >
                  <div>
                    <p className="font-semibold">📝 {file.filename}</p>
                    <p className="text-xs text-gray-400">
                      Last updated {moment(file.updatedAt).fromNow()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(file.content, file._id);
                      }}
                      className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                    >
                      {copiedFileId === file._id ? "✅ Copied" : "📋 Copy"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file._id);
                      }}
                      className="text-sm bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {expandedFile === file._id && (
                  <textarea
                    value={file.content}
                    onChange={(e) =>
                      updateFileContent(file._id, e.target.value)
                    }
                    className="w-full bg-[#1a1a1a] text-sm p-4 font-mono border-t border-gray-600 outline-none"
                    rows={10}
                    spellCheck={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
