// import React, { useState, useEffect } from "react";
// import { ResizableBox } from "react-resizable";
// import "react-resizable/css/styles.css";

// const YouTubePlayer = ({ videoId }) => {
//   const [width, setWidth] = useState(480);
//   const [height, setHeight] = useState(window.innerHeight);

//   const handleResize = (event, { size }) => {
//     setWidth(size.width);
//   };

//   useEffect(() => {
//     const handleWindowResize = () => setHeight(window.innerHeight);
//     window.addEventListener("resize", handleWindowResize);
//     return () => window.removeEventListener("resize", handleWindowResize);
//   }, []);

//   const youtubeUrl = videoId
//     ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
//     : null;

//   return (
//     <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
//       {/* Left: Main Website */}
//       <div className="flex-1 h-full border-r border-gray-700">
//         <iframe
//           src="https://overreacted.io/"
//           className="w-full h-full"
//           title="Blog Content"
//           frameBorder="0"
//         />
//       </div>

//       {/* Right: Resizable YouTube Player */}
//       <ResizableBox
//         width={width}
//         height={height}
//         axis="x"
//         minConstraints={[320, height]}
//         maxConstraints={[800, height]}
//         onResize={handleResize}
//         resizeHandles={["w"]}
//         className="relative bg-black border-l border-gray-700"
//       >
//         {/* Optional resize handle styling */}
//         <div className="absolute left-0 top-0 h-full w-1 bg-gray-600 opacity-40 hover:opacity-100 cursor-col-resize z-50" />
//         {youtubeUrl ? (
//           <iframe
//             src={youtubeUrl}
//             title="YouTube Player"
//             className="w-full h-full"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//         ) : (
//           <div className="text-gray-400 p-4">No video selected</div>
//         )}
//       </ResizableBox>
//     </div>
//   );
// };

// export default YouTubePlayer;
import React, { useState, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import VideoPlayer from "./VideoPlayer";

const YouTubePlayer = ({ videoId }) => {
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = (event, { size }) => {
    setWidth(size.width);
  };

  useEffect(() => {
    const handleWindowResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Backend proxy URL
  const backendStreamUrl = videoId
    ? `https://poultry-sims-campaign-panic.trycloudflare.com/hls/${videoId}`
    : null;
  const [m3u8Url, setM3u8Url] = useState(null);

  useEffect(() => {
    const generateStream = async () => {
      try {
        const res = await fetch(
          `https://poultry-sims-campaign-panic.trycloudflare.com/hls/${videoId}`
        );
        const data = await res.json();
        console.log("Data", data);
        // Append full cloudflare path to returned relative path
        const fullUrl = `https://poultry-sims-campaign-panic.trycloudflare.com${data.m3u8}`;
        setM3u8Url(fullUrl);
      } catch (err) {
        console.error("Failed to generate HLS stream", err);
      }
    };

    generateStream();
  }, [videoId]);
  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
      {/* Left: Fake Disguise Content */}
      <div className="flex-1 h-full border-r border-gray-700">
        <iframe
          src="https://overreacted.io/"
          className="w-full h-full"
          title="Blog Content"
          frameBorder="0"
        />
      </div>

      {/* Right: Resizable Player */}
      <ResizableBox
        width={width}
        height={height}
        axis="x"
        minConstraints={[320, height]}
        maxConstraints={[800, height]}
        onResize={handleResize}
        resizeHandles={["w"]}
        className="relative bg-black border-l border-gray-700"
      >
        {/* Resize handle bar */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gray-600 opacity-40 hover:opacity-100 cursor-col-resize z-50" />

        {backendStreamUrl ? (
          // <video
          //   className="w-full h-full"
          //   controls
          //   autoPlay
          //   muted
          //   preload="auto"
          //   src={backendStreamUrl}
          // />
          <>
            Watching Video : {videoId}
            <VideoPlayer m3u8Url={m3u8Url} />
          </>
        ) : (
          <div className="text-gray-400 p-4">No video selected</div>
        )}
      </ResizableBox>
    </div>
  );
};

export default YouTubePlayer;
