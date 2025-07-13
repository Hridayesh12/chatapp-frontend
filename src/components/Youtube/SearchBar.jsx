// components/SearchBar.jsx
import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ setVideos, apiKey }) => {
  const [query, setQuery] = useState("");

  const searchYouTube = async () => {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          type: "video,playlist",
          maxResults: 50,
          q: query,
          key: apiKey,
        },
      }
    );

    setVideos(res.data.items);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchYouTube();
  };

  return (
    <div className="flex">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search videos/playlists..."
        className="bg-[#2a2a2a] text-white p-2 w-full border border-gray-600 rounded-l-md"
      />
      <button
        onClick={searchYouTube}
        className="bg-blue-600 px-4 text-white rounded-r-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
