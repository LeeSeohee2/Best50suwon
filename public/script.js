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

async function initializeSectionVideo(sectionId, query) {
    const eventContainer = document.querySelector(`#${sectionId} .event-item`);
    try {
        const videos = await fetchVideos(query);
        if (videos.length > 0) {
            const videoURL = videos[0].videos.medium.url;
            const videoElement = document.createElement('video');
            videoElement.src = videoURL;
            videoElement.autoplay = true;
            videoElement.loop = true;
            videoElement.muted = true;
            eventContainer.appendChild(videoElement);
        } else {
            console.warn(`${sectionId} 섹션에서 비디오를 가져올 수 없습니다.`);
        }
    } catch (error) {
        console.error(`${sectionId} 섹션 초기화 중 오류 발생:`, error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSectionVideo('events', 'discount sunglasses');
    initializeSectionVideo('contact-lens-reservation', 'contact lens deals');
});
