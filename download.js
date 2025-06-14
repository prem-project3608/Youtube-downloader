const express = require('express');
const router = express.Router();
const { handleDownload } = require('../utils/handler');

router.post('/', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const data = await handleDownload(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch media info' });
    }
});

module.exports = router;