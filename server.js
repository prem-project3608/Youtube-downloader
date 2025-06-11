const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'prem-babu'; // Set your API key

app.use(cors());
app.use(express.static('public'));

app.get('/youtube', async (req, res) => {
  const { id, type, apikey } = req.query;

  if (!id || !type || !apikey) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  if (apikey !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API Key.' });
  }

  const url = `https://www.youtube.com/watch?v=${id}`;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube Video ID.' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: type === 'audio' ? 'highestaudio' : 'highestvideo' });

    res.json({
      title: info.videoDetails.title,
      downloadUrl: format.url
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
