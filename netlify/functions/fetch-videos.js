const fetch = require('node-fetch');

exports.handler = async (event) => {
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
    const query = event.queryStringParameters.query || 'default';
    const PIXABAY_VIDEO_API_URL = `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&video_type=all`;

    try {
        const response = await fetch(PIXABAY_VIDEO_API_URL);
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
