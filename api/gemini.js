import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  if (!prompt) {
    return res.status(400).json({ message: 'プロンプトが必要です' });
  }

  try {
    console.log('Sending request to Gemini API with prompt:', prompt);

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      console.error('Gemini API Error Status:', response.status);
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      return res.status(response.status).json({
        message: 'Gemini APIからエラーレスポンスを受け取りました',
        error: errorText
      });
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));

    // エラーチェック
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return res.status(500).json({
        message: 'Gemini APIでエラーが発生しました',
        error: data.error
      });
    }

    // 成功時のレスポンス
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
}
