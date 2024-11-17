async function fetchVideos(query) {
    const url = `/api/fetch-videos?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch videos: ${response.statusText}`);
        }
        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error.message);
        throw error;
    }
}
