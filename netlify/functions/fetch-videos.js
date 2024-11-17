const fetch = require('node-fetch');

exports.handler = async function (event) {
    const query = event.queryStringParameters.query || '';
    const perPage = event.queryStringParameters.perPage || 10;

    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&video_type=all&per_page=${perPage}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch data from Pixabay API' }),
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error', details: error.message }),
        };
    }
};
