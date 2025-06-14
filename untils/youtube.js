const ytdl = require('ytdl-core');

async function download(url) {
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
    return {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails.pop().url,
        formats: formats.map(f => ({
            quality: f.qualityLabel,
            url: f.url,
            type: f.container
        }))
    };
}

module.exports = { download };