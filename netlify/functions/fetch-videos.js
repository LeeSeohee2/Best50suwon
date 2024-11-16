const fetch = require('node-fetch');

exports.handler = async (event) => {
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
    const PIXABAY_VIDEO_API_URL = `https://pixabay.com/api/videos/`;

    const query = event.queryStringParameters.query || 'default';
    const url = `${PIXABAY_VIDEO_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&video_type=all&per_page=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
