const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const API_KEY = 'YOUR_YOUTUBE_API_KEY';
const CHANNEL_ID = 'UCMiJRAwDNSNzuYeN2uWa0pA'; // Mrwhosetheboss's channel ID

app.get('/', async (req, res) => {
    try {
        // Fetch channel banner
        const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${CHANNEL_ID}&key=${API_KEY}`);
        const bannerUrl = channelResponse.data.items[0].brandingSettings.image.bannerExternalUrl;

        // Fetch videos
        const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50`);
        const videos = videoResponse.data.items;

        // Fetch playlists
        const playlistResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&key=${API_KEY}`);
        const playlists = playlistResponse.data.items;

        res.render('index', { bannerUrl, videos, playlists });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from YouTube API');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
