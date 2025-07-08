const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs for websites

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's PORT or default to 3000

// --- Middleware ---
// Enable CORS for all origins (important for your GitHub Pages frontend)
// In a real production app, you'd restrict this to your specific frontend URL.
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// --- Simple In-Memory Database (for now) ---
// In a real application, you would connect to a database like MongoDB, PostgreSQL, etc.
// This array will hold objects like: { id: 'uuid', title: 'Website Title', htmlContent: '<html>...', cssContent: '<style>...' }
let savedWebsites = [];

// --- API Endpoints ---

// 1. POST /api/websites
// Endpoint to save a new user-created website
app.post('/api/websites', (req, res) => {
    const { title, htmlContent, cssContent } = req.body;

    if (!htmlContent) {
        return res.status(400).json({ message: 'HTML content is required to save a website.' });
    }

    const newWebsite = {
        id: uuidv4(), // Generate a unique ID
        title: title || `Untitled Website ${savedWebsites.length + 1}`, // Default title
        htmlContent: htmlContent,
        cssContent: cssContent || '', // CSS might be optional or empty
        createdAt: new Date().toISOString()
    };

    savedWebsites.push(newWebsite);
    console.log('Website saved:', newWebsite.id);
    res.status(201).json({ message: 'Website saved successfully!', websiteId: newWebsite.id });
});

// 2. GET /api/websites
// Endpoint to get a list of all saved websites (for a gallery/list page)
app.get('/api/websites', (req, res) => {
    // We only send basic info, not the full HTML/CSS for the list
    const websiteList = savedWebsites.map(site => ({
        id: site.id,
        title: site.title,
        createdAt: site.createdAt
    }));
    res.status(200).json(websiteList);
});

// 3. GET /api/websites/:id
// Endpoint to get the full content of a specific saved website
app.get('/api/websites/:id', (req, res) => {
    const websiteId = req.params.id;
    const website = savedWebsites.find(site => site.id === websiteId);

    if (!website) {
        return res.status(404).json({ message: 'Website not found.' });
    }

    // Send the full content
    res.status(200).json({
        id: website.id,
        title: website.title,
        htmlContent: website.htmlContent,
        cssContent: website.cssContent
    });
});


// Basic route for root URL (optional, good for health check)
app.get('/', (req, res) => {
    res.send('Website Builder Backend is running!');
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access at http://localhost:${PORT}`);
});
