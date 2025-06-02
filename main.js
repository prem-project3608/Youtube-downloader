// server.js

const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 10000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/download', (req, res) => {
  const url = req.body.url;
  const format = req.body.format;

  if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
    return res.status(400).send('Invalid YouTube URL');
  }

  const timestamp = Date.now();
  const filename = `download_${timestamp}.${format === 'audio' ? 'mp3' : 'mp4'}`;
  const filepath = path.join(__dirname, 'downloads', filename);

  const command = format === 'audio'
    ? `yt-dlp -x --audio-format mp3 -o "${filepath}" "${url}"`
    : `yt-dlp -f mp4 -o "${filepath}" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).send('Download failed.');
    }

    res.download(filepath, filename, (err) => {
      if (err) console.error('Download error:', err);
      fs.unlink(filepath, () => {}); // Clean up after download
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
