import axios from "axios";

export const fetchAllPlaylistItems = async (playlistId, apiKey) => {
    let allItems = [];
    let nextPageToken = "";

    try {
        do {
            const res = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
                params: {
                    part: "snippet",
                    playlistId: playlistId,
                    maxResults: 100,
                    pageToken: nextPageToken,
                    key: apiKey,
                },
            });

            const newItems = res.data.items.map((item) => ({
                id: { videoId: item.snippet.resourceId.videoId },
                snippet: item.snippet,
            }));

            allItems.push(...newItems);
            nextPageToken = res.data.nextPageToken;
        } while (nextPageToken);
    } catch (err) {
        console.error("Error fetching playlist videos:", err);
    }

    return allItems;
};
