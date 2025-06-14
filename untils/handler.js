const youtube = require('./youtube');
const instagram = require('./instagram');
const facebook = require('./facebook');
const tiktok = require('./tiktok');

function detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('tiktok.com')) return 'tiktok';
    return null;
}

async function handleDownload(url) {
    const platform = detectPlatform(url);
    if (!platform) throw new Error('Unsupported platform');

    switch (platform) {
        case 'youtube': return await youtube.download(url);
        case 'instagram': return await instagram.download(url);
        case 'facebook': return await facebook.download(url);
        case 'tiktok': return await tiktok.download(url);
        default: throw new Error('Unknown platform');
    }
}

module.exports = { handleDownload };