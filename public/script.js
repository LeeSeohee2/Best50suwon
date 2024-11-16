// Pixabay API에서 동영상 데이터 가져오기 (Proxy 사용)
async function fetchVideos(query, perPage = 10) {
    const url = `/api/fetch-videos?query=${encodeURIComponent(query)}&perPage=${perPage}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.hits;
        } else {
            const errorText = await response.text();
            console.error(`Proxy API 요청 실패: ${response.status} - ${errorText}`);
            return [];
        }
    } catch (error) {
        console.error(`Proxy API 호출 중 오류 발생: ${error}`);
        return [];
    }
}

// 특정 섹션에 비디오 삽입
async function initializeSectionVideo(sectionId, query) {
    const eventContainer = document.querySelector(`#${sectionId} .event-item`);

    // 로컬 스토리지에서 데이터 로드
    const cachedData = loadFromLocalStorage(`${sectionId}Video`);
    if (cachedData) {
        console.log(`${sectionId} 섹션: 로컬 스토리지 데이터 사용`);
        return insertVideo(eventContainer, cachedData.videoURL);
    }

    // Proxy API에서 새 데이터 가져오기
    const videos = await fetchVideos(query, 10);
    if (videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * videos.length);
        const selectedVideo = videos[randomIndex];
        const videoURL = selectedVideo.videos.medium.url;

        // 비디오 삽입 및 로컬 스토리지에 저장
        insertVideo(eventContainer, videoURL);
        saveToLocalStorage(`${sectionId}Video`, { videoURL });
    } else {
        console.warn(`${sectionId} 섹션: 관련 비디오를 로드하지 못했습니다.`);
    }
}
