// 환경변수에서 API 키 로드 (Netlify 환경변수 사용)
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_VIDEO_API_URL = 'https://pixabay.com/api/videos/';

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
        if (parsed.date === getTodayDate()) return parsed;
        return null;
    } catch (e) {
        console.error('로컬 스토리지 파싱 오류:', e);
        return null;
    }
}

async function fetchVideos(query, perPage = 10) {
    const url = `${PIXABAY_VIDEO_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&video_type=all&per_page=${perPage}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.hits;
        } else {
            const errorText = await response.text();
            console.error(`Pixabay API 요청 실패: ${response.status} - ${errorText}`);
            return [];
        }
    } catch (error) {
        console.error(`Pixabay API 호출 중 오류 발생: ${error}`);
        return [];
    }
}

async function initializeSectionVideo(sectionId, query) {
    const eventContainer = document.querySelector(`#${sectionId} .event-item`);
    const cachedData = loadFromLocalStorage(`${sectionId}Video`);
    if (cachedData) {
        return insertVideo(eventContainer, cachedData.videoURL);
    }

    const videos = await fetchVideos(query, 10);
    if (videos.length > 0) {
        const videoURL = videos[Math.floor(Math.random() * videos.length)].videos.medium.url;
        insertVideo(eventContainer, videoURL);
        saveToLocalStorage(`${sectionId}Video`, { videoURL });
    }
}

function insertVideo(container, videoURL) {
    const existingVideo = container.querySelector('video');
    if (existingVideo) existingVideo.remove();

    const videoElement = document.createElement('video');
    videoElement.src = videoURL;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    container.insertBefore(videoElement, container.querySelector('.event-details'));
}

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    initializeSectionVideo('events', 'discount sunglasses');
    initializeSectionVideo('contact-lens-reservation', 'contact lens deals');
});
