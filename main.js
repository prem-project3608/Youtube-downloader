// server.js

const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = 10000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const format = req.body.format;

  if (!ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');

    if (format === 'audio') {
      res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
      ytdl(url, { filter: 'audioonly' }).pipe(res);
    } else {
      res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
      ytdl(url, { quality: 'highestvideo' }).pipe(res);
    }
  } catch (err) {
    res.status(500).send(`Download failed: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
