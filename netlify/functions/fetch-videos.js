const fetch = require('node-fetch');

exports.handler = async (event) => {
    console.log('Event:', event); // 요청 확인 로그
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
    if (!PIXABAY_API_KEY) {
        console.error('PIXABAY_API_KEY is not defined');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'PIXABAY_API_KEY is not defined' }),
        };
    }

    const query = event.queryStringParameters.query || 'default';
    const PIXABAY_VIDEO_API_URL = `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&video_type=all`;

    try {
        const response = await fetch(PIXABAY_VIDEO_API_URL);
        const data = await response.json();
        console.log('Pixabay API Response:', data); // 응답 데이터 로그
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error fetching from Pixabay API:', error); // 오류 로그
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
