// VideoPlayer.jsx
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ m3u8Url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // ❗ Prevent null or empty m3u8Url
    if (!m3u8Url || typeof m3u8Url !== "string" || m3u8Url.trim() === "") {
      console.warn("⛔ Invalid or missing m3u8Url");
      return;
    }

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(m3u8Url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS.js error:", data);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = m3u8Url;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [m3u8Url]);

  return (
    <video
      ref={videoRef}
      controls
      width="100%"
      height="auto"
      style={{ borderRadius: "10px", backgroundColor: "#000" }}
    />
  );
};

export default VideoPlayer;
