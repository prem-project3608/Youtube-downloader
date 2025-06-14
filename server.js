const express = require('express');
const path = require('path');
const app = express();
const downloadRouter = require('./routes/download');

app.use(express.static('public'));
app.use(express.json());

app.use('/download', downloadRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));