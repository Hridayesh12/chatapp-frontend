import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ m3u8Url, maxRetries = 30 }) => {
  const videoRef = useRef(null);
  const [isStreamReady, setIsStreamReady] = useState(false);

  useEffect(() => {
    if (!m3u8Url || typeof m3u8Url !== "string" || m3u8Url.trim() === "") {
      console.warn("⛔ Invalid or missing m3u8Url");
      return;
    }

    let attempt = 0;
    let hlsInstance = null;

    const checkAndPlay = async () => {
      try {
        const res = await fetch(`${m3u8Url}?_ts=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          setIsStreamReady(true);

          if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(m3u8Url);
            hlsInstance.attachMedia(videoRef.current);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current.play();
            });

            hlsInstance.on(Hls.Events.ERROR, (event, data) => {
              console.error("HLS.js error:", data);
            });
          } else if (
            videoRef.current.canPlayType("application/vnd.apple.mpegurl")
          ) {
            videoRef.current.src = m3u8Url;
            videoRef.current.addEventListener("loadedmetadata", () => {
              videoRef.current.play();
            });
          }
        } else {
          retryLater();
        }
      } catch (err) {
        retryLater();
      }
    };

    const retryLater = () => {
      if (attempt++ < maxRetries) {
        setTimeout(checkAndPlay, 2000); // retry after 2 seconds
      } else {
        console.error("❌ Failed to load stream after max retries.");
      }
    };

    checkAndPlay();

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [m3u8Url, maxRetries]);

  return (
    <>
      {!isStreamReady && (
        <p style={{ color: "white", textAlign: "center" }}>
          ⏳ Loading stream, please wait...
        </p>
      )}
      <video
        ref={videoRef}
        controls
        width="100%"
        height="auto"
        style={{
          borderRadius: "10px",
          backgroundColor: "#000",
          display: isStreamReady ? "block" : "none",
        }}
      />
    </>
  );
};

export default VideoPlayer;
