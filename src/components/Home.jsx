import React from "react";

const Home = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🌐 Embedded Research Site</h2>
      <div className="w-full h-[85vh]">
        <iframe
          src="https://overreacted.io/"
          className="w-full h-full rounded-md border border-gray-800 shadow"
          title="Blog Content"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default Home;
