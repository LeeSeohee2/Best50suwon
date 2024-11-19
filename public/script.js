// Netlify Functions를 사용하여 Pixabay API를 프록시로 호출
async function fetchVideos(query, perPage = 10) {
    const url = `/.netlify/functions/fetch-videos?query=${encodeURIComponent(query)}&perPage=${perPage}`;
    console.log(`Fetching videos with query: ${query}`);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Proxy API 요청 실패: ${response.status} - ${errorText}`);
            return [];
        }

        const data = await response.json();
        return data.hits || [];
    } catch (error) {
        console.error('Pixabay API 호출 중 오류 발생:', error);
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

    // Netlify Functions를 통해 비디오 데이터 가져오기
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
    videoElement.playsInline = true; // 모바일에서 인라인 재생 허용
    videoElement.setAttribute('allow', 'autoplay'); // 명시적 autoplay 허용
    videoElement.style.width = '100%';
    videoElement.style.height = '100vh';
    videoElement.style.objectFit = 'cover';

    container.insertBefore(videoElement, container.querySelector('.event-details'));

    // 사용자 상호작용 이벤트 처리 (모바일 대응)
    document.body.addEventListener('touchstart', () => {
        videoElement.play().catch(error => {
            console.error('비디오 재생 중 오류:', error);
        });
    }, { once: true }); // 한 번만 실행
}

// 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 로컬 스토리지에 데이터 저장 헬퍼 함수
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify({
        date: getTodayDate(),
        ...data
    }));
}

// 로컬 스토리지에서 데이터 불러오기 (날짜 유효성 확인 포함)
function loadFromLocalStorage(key) {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
        const parsed = JSON.parse(stored);
        if (parsed.date === getTodayDate()) {
            return parsed;
        }
        return null;
    } catch (e) {
        console.error('로컬 스토리지 파싱 오류:', e);
        return null;
    }
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
    initializeSectionVideo('events', 'discount'); // 이달의 행사 섹션 초기화
    initializeSectionVideo('contact-lens-reservation', 'networking'); // 콘택트렌즈 예약 섹션 초기화
});
