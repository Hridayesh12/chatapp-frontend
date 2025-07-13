import React, { useState } from "react";
import SearchBar from "./SearchBar";
import axios from "axios";
import YouTubePlayer from "./YoutubePlayer";
import { fetchAllPlaylistItems } from "../../utils/fetchAllPlaylist";

const YoutubeComponent = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [query, setQuery] = useState("");
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false); // 🚨 Panic mode

  const API_KEY = "AIzaSyA2OY3hK6spFlbhAh5oEDb_wfhxnNOXiIA";

  const handleVideoClick = async (video) => {
    if (video.id.kind === "youtube#playlist") {
      const playlistId = video.id.playlistId;
      setLoadingPlaylist(true);

      const allPlaylistVideos = await fetchAllPlaylistItems(
        playlistId,
        API_KEY
      );

      setLoadingPlaylist(false);

      if (allPlaylistVideos.length > 0) {
        setVideos(allPlaylistVideos);
        setSelectedVideo(allPlaylistVideos[0]);
      }
    } else {
      setSelectedVideo(video);
    }
  };

  const loadMoreResults = async () => {
    if (!nextPageToken || !query) return;

    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          type: "video,playlist",
          maxResults: 10,
          q: query,
          key: API_KEY,
          pageToken: nextPageToken,
        },
      }
    );

    setVideos((prev) => [...prev, ...res.data.items]);
    setNextPageToken(res.data.nextPageToken || null);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-200 p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold hidden sm:block">
          Internal Insights Viewer
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEmergencyMode(true)}
            className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            title="Quick View"
          >
            Quick View
          </button>
          <button
            onClick={() => setEmergencyMode(false)}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
            title="Restore Original"
          >
            Restore View
          </button>
        </div>
      </div>

      {emergencyMode ? (
        // Emergency full-screen iframe
        <div className="w-full h-[85vh]">
          <iframe
            src="https://overreacted.io/"
            className="w-full h-full rounded-md border border-gray-800 shadow"
            title="Blog Content"
            frameBorder="0"
          />
        </div>
      ) : (
        <>
          <SearchBar
            setVideos={setVideos}
            setNextPageToken={setNextPageToken}
            setQuery={setQuery}
            apiKey={API_KEY}
          />

          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            {/* Player Section */}
            <div className="w-full lg:w-3/4 bg-[#2a2a2a] rounded-xl shadow p-2 min-h-[240px]">
              {selectedVideo?.id?.videoId ? (
                <YouTubePlayer videoId={selectedVideo.id.videoId} />
              ) : (
                <div className="flex items-center justify-center h-[240px] text-gray-400">
                  No report selected
                </div>
              )}
            </div>

            {/* Video List Section */}
            <div className="w-full lg:w-1/4 space-y-2 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 bg-[#2a2a2a] rounded-xl p-2">
              {loadingPlaylist && (
                <div className="text-center text-gray-400 py-2 animate-pulse">
                  Loading full playlist...
                </div>
              )}
              {videos.map((video, index) => (
                <div
                  key={`${video.id.videoId || video.id.playlistId}-${index}`}
                  className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="flex items-start gap-2">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt=""
                      className="w-20 h-14 object-cover rounded-md"
                    />
                    <div>
                      <div className="text-sm font-medium leading-tight line-clamp-2">
                        {video.snippet.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {video.id.kind === "youtube#playlist"
                          ? "📃 Playlist"
                          : "▶️ Video"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {nextPageToken && !loadingPlaylist && (
                <button
                  onClick={loadMoreResults}
                  className="w-full bg-gray-700 text-white p-2 rounded hover:bg-gray-600"
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default YoutubeComponent;
