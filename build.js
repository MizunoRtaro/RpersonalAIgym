const fs = require('fs');
const path = require('path');

function processFile(filename) {
    const filePath = path.join(__dirname, filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // YouTube API キーの置換
    content = content.replace('process.env.YOUTUBE_API_KEY', `"${process.env.YOUTUBE_API_KEY}"`);

    // Gemini API キーの置換
    content = content.replace('process.env.GEMINI_API_KEY', `"${process.env.GEMINI_API_KEY}"`);

    fs.writeFileSync(filePath, content);
}

// index.html を処理
processFile('index.html');

// trainer.html を処理
processFile('trainer.html');
