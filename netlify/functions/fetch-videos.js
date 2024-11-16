exports.handler = async (event) => {
    console.log('Event:', event); // 로그 추가
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
    const query = event.queryStringParameters.query || 'default';
    console.log('Query:', query); // 로그 추가

    try {
        const response = await fetch(/* ... */);
        console.log('Response:', response); // 로그 추가
        // ...
    } catch (error) {
        console.error('Error:', error); // 로그 추가
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
