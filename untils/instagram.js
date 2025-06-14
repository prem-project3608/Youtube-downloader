async function download(url) {
    return {
        title: 'Instagram media',
        thumbnail: '',  // You can implement scraping logic
        formats: [{ quality: 'HD', url: url, type: 'mp4' }]
    };
}

module.exports = { download };