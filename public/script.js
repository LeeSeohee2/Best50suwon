async function fetchVideos(query) {
    const url = `/api/fetch-videos?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.hits;
        } else {
            console.error(`Proxy API 요청 실패: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error(`API 호출 중 오류 발생: ${error}`);
        return [];
    }
}

async function initializeSectionVideo(sectionId, query) {
    const eventContainer = document.querySelector(`#${sectionId} .event-item`);

    const videos = await fetchVideos(query);
    if (videos.length > 0) {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        insertVideo(eventContainer, randomVideo.videos.medium.url);
    } else {
        console.warn(`${sectionId} 섹션에서 비디오를 가져올 수 없습니다.`);
    }
}

function insertVideo(container, videoURL) {
    const videoElement = document.createElement('video');
    videoElement.src = videoURL;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.style.width = '100%';
    videoElement.style.height = '100vh';

    container.prepend(videoElement);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSectionVideo('events', 'discount sunglasses');
    initializeSectionVideo('contact-lens-reservation', 'contact lens');
});
