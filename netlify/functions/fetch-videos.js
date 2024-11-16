const fetch = require('node-fetch'); // node-fetch 모듈 사용

exports.handler = async (event) => {
    console.log('Event object:', event); // 요청 이벤트 로깅

    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY; // 환경변수에서 API 키 가져오기
    if (!PIXABAY_API_KEY) {
        console.error('PIXABAY_API_KEY is missing'); // API 키 누락 시 로그 출력
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'PIXABAY_API_KEY is not defined in environment variables' }),
        };
    }

    // 요청에서 query 파라미터 가져오기
    const query = event.queryStringParameters.query || 'default';
    console.log('Received query:', query);

    // Pixabay API URL 생성
    const PIXABAY_VIDEO_API_URL = `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&video_type=all`;

    try {
        console.log('Fetching from Pixabay API:', PIXABAY_VIDEO_API_URL); // 호출 URL 로깅
        const response = await fetch(PIXABAY_VIDEO_API_URL);
        
        if (!response.ok) {
            console.error('Pixabay API response error:', response.status, response.statusText); // 오류 상태 코드 로깅
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: response.statusText }),
            };
        }

        const data = await response.json();
        console.log('Pixabay API response data:', data); // 응답 데이터 로깅

        return {
            statusCode: 200,
            body: JSON.stringify(data), // 정상 응답 반환
        };
    } catch (error) {
        console.error('Error fetching from Pixabay API:', error); // 호출 중 예외 처리
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
