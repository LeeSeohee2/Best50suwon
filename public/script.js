// Pixabay API를 Proxy로 호출하는 경로
async function fetchVideos(query) {
    const url = `/api/fetch-videos?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Proxy API 요청 실패: ${response.status}`);
            throw new Error(`Failed to fetch videos: ${response.statusText}`);
        }
        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error.message);
        throw error; // 오류를 상위 호출로 전달
    }
}

// 특정 섹션에 비디오 삽입
async function initializeSectionVideo(sectionId, query) {
    const eventContainer = document.querySelector(`#${sectionId} .event-item`);

    try {
        const videos = await fetchVideos(query);
        if (videos.length > 0) {
            const randomIndex = Math.floor(Math.random() * videos.length);
            const selectedVideo = videos[randomIndex];
            const videoURL = selectedVideo.videos.medium.url;

            // 비디오 삽입
            insertVideo(eventContainer, videoURL);
        } else {
            console.warn(`${sectionId} 섹션: 관련 비디오를 가져올 수 없습니다.`);
        }
    } catch (error) {
        console.error(`${sectionId} 섹션에서 비디오를 가져오는 동안 오류 발생:`, error.message);
    }
}

// 비디오 요소 삽입
function insertVideo(container, videoURL) {
    // 기존 비디오 제거
    const existingVideo = container.querySelector('video');
    if (existingVideo) {
        existingVideo.remove();
    }

    // 새 비디오 요소 생성 및 삽입
    const videoElement = document.createElement('video');
    videoElement.src = videoURL;
    videoElement.controls = false;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.style.width = '100%';
    videoElement.style.height = '100vh';
    videoElement.style.objectFit = 'cover';

    container.insertBefore(videoElement, container.querySelector('.event-details'));
}

// 네비게이션 바 스크롤 시 배경색 변경
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 모바일 메뉴 토글
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// 페이지 로드 시 초기화 함수 호출
document.addEventListener('DOMContentLoaded', () => {
    initializeSectionVideo('events', 'discount sunglasses'); // 이달의 행사 섹션 초기화
    initializeSectionVideo('contact-lens-reservation', 'contact lens deals'); // 콘택트렌즈 예약 섹션 초기화
});
