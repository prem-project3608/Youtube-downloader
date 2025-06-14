require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const CUSTOM_API_KEY = process.env.CUSTOM_API_KEY;

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Search YouTube using official API
app.get('/search', async (req, res) => {
  const { q, apikey } = req.query;

  if (!q || !apikey) return res.status(400).json({ error: 'Missing parameters' });
  if (apikey !== CUSTOM_API_KEY) return res.status(403).json({ error: 'Invalid API Key' });

  try {
    const youtube = google.youtube('v3');
    const response = await youtube.search.list({
      key: YT_API_KEY,
      q,
      part: 'snippet',
      maxResults: 1,
      type: 'video'
    });

    if (!response.data.items.length) {
      return res.status(404).json({ error: 'No results found' });
    }

    const video = response.data.items[0];
    const videoId = video.id.videoId;

    res.json({
      videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.default.url
    });
  } catch (err) {
    res.status(500).json({ error: 'YouTube API error', details: err.message });
  }
});

// Download link generator
app.get('/youtube', async (req, res) => {
  const { id, type, apikey } = req.query;

  if (!id || !type || !apikey) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  if (apikey !== CUSTOM_API_KEY) {
    return res.status(403).json({ error: 'Invalid API Key.' });
  }

  const url = `https://www.youtube.com/watch?v=${id}`;
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube Video ID.' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: type === 'audio' ? 'highestaudio' : 'highestvideo',
    });

    res.json({
      title: info.videoDetails.title,
      downloadUrl: format.url,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      quality: format.qualityLabel || 'audio',
      type
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
