const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const { SKI_RESORTS } = require('./resorts-database');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static('static'));

// Helper function to fetch historical weather data from Open-Meteo Archive API
function fetchWeatherData(lat, lon) {
    return new Promise((resolve, reject) => {
        // Calculate date range: last 90 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        
        const formatDate = (date) => date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Open-Meteo Historical Archive API - Free, no key required!
        // This gives us ACTUAL historical snowfall, not forecasts
        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&daily=snowfall_sum&timezone=auto`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// No region grouping - each resort is its own datapoint

// Fetch real snow data from Open-Meteo for each individual resort
async function fetchRealSnowData() {
    const data = {
        timestamp: new Date().toISOString(),
        regions: [] // Keep same structure for frontend compatibility
    };

    console.log(`[${new Date().toLocaleTimeString()}] Fetching real snow data for ${SKI_RESORTS.length} resorts...`);

    // Process each resort individually
    for (const resort of SKI_RESORTS) {
        try {
            // Fetch weather data for this resort's exact coordinates
            const [lat, lon] = resort.coords;
            const weatherData = await fetchWeatherData(lat, lon);
            
            // Extract snow data from API response
            const daily = weatherData.daily || {};
            const snowfallArray = daily.snowfall_sum || [];
            
            if (snowfallArray.length === 0) {
                throw new Error('No snowfall data available');
            }
            
            // Archive API returns actual historical data (no forecasts)
            // Last entry = today (most recent day)
            const newSnow24hCm = snowfallArray[snowfallArray.length - 1] || 0;
            
            // Calculate 7-day snowfall (last 7 entries)
            const newSnow7dCm = snowfallArray.slice(-7).reduce((sum, val) => sum + (val || 0), 0);
            
            // Calculate 90-day total snowfall (all entries)
            const snow90dCm = snowfallArray.reduce((sum, val) => sum + (val || 0), 0);
            
            // Convert cm to inches (cm * 0.3937)
            const newSnow24hInches = Math.round(newSnow24hCm * 0.3937 * 10) / 10; // 1 decimal place
            const newSnow7dInches = Math.round(newSnow7dCm * 0.3937);
            const snow90dInches = Math.round(snow90dCm * 0.3937);
            
            // Calculate intensity score (0-100)
            // Heavily weighted toward recent snowfall (24h is most important)
            const rawIntensity = (newSnow24hInches * 4.0) + (newSnow7dInches * 1.2);
            
            // Japow Factor: Boost Japan resorts to reflect their legendary status
            let finalIntensity = rawIntensity;
            if (resort.region && (resort.region.includes("Hokkaido") || resort.region.includes("Honshu"))) {
                finalIntensity = Math.max(20, rawIntensity * 2.0); // Minimum 'Good' intensity + double boost
            }
            
            const intensity = Math.min(100, finalIntensity);
            
            data.regions.push({
                name: resort.name,
                coords: [lon, lat], // [lon, lat] format for D3.js
                snow_90d: snow90dInches, // Total snowfall last 3 months (replaces base_depth)
                new_snow_24h: newSnow24hInches,
                new_snow_7d: newSnow7dInches,
                resort_count: 1, // Each resort is its own datapoint
                intensity: Number(intensity.toFixed(1)),
                resorts: [resort.name], // Single resort
                region: resort.region, // Keep region info for reference
                elevation: resort.elevation
            });
            
            // Small delay to avoid rate limiting (100ms = 10 requests/second)
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(`Error fetching data for ${resort.name}:`, error.message);
            // Fallback to zero values if API fails
            data.regions.push({
                name: resort.name,
                coords: [resort.coords[1], resort.coords[0]], // [lon, lat]
                snow_90d: 0,
                new_snow_24h: 0,
                new_snow_7d: 0,
                resort_count: 1,
                intensity: 0,
                resorts: [resort.name],
                region: resort.region,
                elevation: resort.elevation
            });
        }
    }

    console.log(`[${new Date().toLocaleTimeString()}] Fetched data for ${data.regions.length} resorts`);
    return data;
}

// Global data store
let currentSnowData = { timestamp: new Date().toISOString(), regions: [] };

// Initial data fetch
(async () => {
    currentSnowData = await fetchRealSnowData();
})();

// Update data every hour
setInterval(async () => {
    currentSnowData = await fetchRealSnowData();
}, 60 * 60 * 1000);

// API Routes
app.get('/api/snow-data', (req, res) => {
    res.json(currentSnowData);
});

app.get('/api/refresh', async (req, res) => {
    currentSnowData = await fetchRealSnowData();
    res.json({ status: "success", timestamp: currentSnowData.timestamp });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.listen(port, () => {
    console.log(`\n============================================================`);
    console.log(`  SNOWDAR TERMINAL v1.0 (Node.js)`);
    console.log(`  Server running on http://localhost:${port}`);
    console.log(`============================================================\n`);
});

