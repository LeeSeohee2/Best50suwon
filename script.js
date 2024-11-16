// 환경변수에서 API 키 가져오기
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || window.PIXABAY_API_KEY;
const PIXABAY_VIDEO_API_URL = 'https://pixabay.com/api/videos/';

// 카테고리 목록
const categories = ['discount sunglasses', 'contact lens deals', 'fashion', 'nature', 'sports'];

// 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeCategoryButtons();
    initializeSectionVideo('events', categories[0]); // 기본 카테고리
});

// 카테고리 버튼 동적 생성
function initializeCategoryButtons() {
    const categoryContainer = document.getElementById('category-buttons');
    categories.forEach((category) => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => {
            initializeSectionVideo('events', category);
        });
        categoryContainer.appendChild(button);
    });
}

// API에서 동영상 데이터 가져오기
async function fetchVideos(query, perPage = 10) {
    const url = `${PIXABAY_VIDEO_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&video_type=all&per_page=${perPage}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.hits;
        } else {
            console.error(`Pixabay API 요청 실패: ${response.statusText}`);
            return [];
        }
    } catch (error) {
        console.error(`Pixabay API 호출 중 오류 발생: ${error}`);
        return [];
    }
}

// 특정 섹션에 비디오 삽입
async function initializeSectionVideo(sectionId, query) {
    const eventContainer = document.querySelector(`#${sectionId} .event-item`);

    const cachedData = loadFromLocalStorage(`${sectionId}Video`);
    if (cachedData) {
        console.log(`${sectionId} 섹션: 로컬 스토리지 데이터 사용`);
        return insertVideo(eventContainer, cachedData.videoURL);
    }

    const videos = await fetchVideos(query, 10);
    if (videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * videos.length);
        const selectedVideo = videos[randomIndex];
        const videoURL = selectedVideo.videos.medium.url;

        insertVideo(eventContainer, videoURL);
        saveToLocalStorage(`${sectionId}Video`, { videoURL });
    } else {
        console.warn(`${sectionId} 섹션: 관련 비디오를 로드하지 못했습니다.`);
    }
}

// 비디오 요소 삽입
function insertVideo(container, videoURL) {
    const existingVideo = container.querySelector('video');
    if (existingVideo) {
        existingVideo.remove();
    }

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

// 로컬 스토리지 관련 함수
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify({ date: getTodayDate(), ...data }));
}

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
