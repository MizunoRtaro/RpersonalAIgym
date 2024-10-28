import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.query;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!query) {
    return res.status(400).json({ message: '検索クエリが必要です' });
  }

  try {
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=5&regionCode=JP&relevanceLanguage=ja`;

    console.log('Fetching from YouTube API:', youtubeUrl.replace(YOUTUBE_API_KEY, 'HIDDEN_KEY'));

    const youtubeResponse = await fetch(youtubeUrl);

    if (!youtubeResponse.ok) {
      console.error('YouTube API Error Status:', youtubeResponse.status);
      const errorText = await youtubeResponse.text();
      console.error('YouTube API Error Response:', errorText);
      return res.status(youtubeResponse.status).json({
        message: 'YouTube APIからエラーレスポンスを受け取りました',
        error: errorText
      });
    }

    const data = await youtubeResponse.json();
    console.log('YouTube API Response:', JSON.stringify(data, null, 2));

    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
}
