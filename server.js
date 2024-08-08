require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/search', async (req, res) => {
    const query = req.query.query;
    // console.log('Incoming request for search:', req.url);
    // console.log('Request query parameter:', query);
    if (!query) {
        console.error('Query parameter is missing.');
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const apiKey = process.env.API_KEY; 
    const searchEngineId = process.env.SEARCH_ENGINE_ID; 

    // console.log('Using API Key:', apiKey);
    // console.log('Using Search Engine ID:', searchEngineId);

    try {
        const params = {
            key: apiKey,
            cx: searchEngineId,
            q: query
        };
        // console.log('Requesting Google Custom Search API with params:', params);

        const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: params
        });
        if (!response.data.items) {
            console.warn('No results found in the API response.');
            return res.status(404).json({ error: 'No results found' });
        }

        const results = response.data.items.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        }));
        // console.log('Search results:', results);
        
        res.json(results);
    } catch (error) {
        // console.error('Error fetching data from Google Custom Search API:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
