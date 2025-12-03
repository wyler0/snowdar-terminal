# SNOWDAR Terminal 🎿❄️

A retro terminal-style 3D globe visualization showing **real-time snow conditions** at 180+ ski resorts worldwide.

![Snowdar Terminal](https://img.shields.io/badge/Status-Live-green) ![Node.js](https://img.shields.io/badge/Node.js-18+-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)


[View It Live](https://snowdar-terminal.onrender.com) via Render.com
---

## 🚀 Features

- **Real Weather Data**: Fetches live snow conditions from [Open-Meteo API](https://open-meteo.com) (free, no API key required)
- **180+ Ski Resorts**: Comprehensive database covering North America, Europe, Asia, South America, and Oceania
- **3D Interactive Globe**: Drag to rotate, scroll to zoom, auto-rotation with smart pause
- **Retro Terminal Aesthetic**: Green-on-black 80's terminal vibe with scanlines and glow effects
- **Regional Grouping**: Resorts grouped into 39 geographical regions for cleaner visualization
- **Gradient Heatmap**: Color-coded hotspots (green → yellow → red) based on snow intensity
- **Hourly Auto-Refresh**: Data updates every hour automatically
- **100% JavaScript Stack**: Node.js backend + vanilla JS frontend (easy to deploy anywhere)

---

## 📊 Data Sources

### Weather API: **Open-Meteo**
- **Free tier**: Unlimited requests, no API key
- **Data provided**: 
  - Current snowfall (cm)
  - 7-day snowfall history
  - Precipitation and temperature
- **Update frequency**: Hourly

### Resort Database
- 180+ ski resorts with accurate coordinates
- Compiled from Wikipedia, OpenStreetMap, and official resort sources
- Organized into 39 regional groups

---

## 🎯 Intensity Calculation

Each region gets an **intensity score (0-100)** based on:

```
intensity = (base_depth × 0.35) + (24h_snowfall × 2.5) + (7d_snowfall × 0.7)
```

**Why these weights?**
- **24h snowfall (2.5x)**: Most important - fresh powder is what skiers care about!
- **7d snowfall (0.7x)**: Shows recent trends
- **Base depth (0.35x)**: Nice to have, but less critical for daily conditions

**Color mapping:**
- 🟢 Green (0-30): Light snow
- 🟡 Yellow (30-60): Moderate snow
- 🔴 Red (60-100): Heavy snow / powder day!

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- Native `https` module for API calls
- CORS enabled for local development

**Frontend:**
- D3.js (v7) for globe rendering and projections
- Vanilla JavaScript (no frameworks)
- CSS3 animations (scanlines, glow, pulse effects)

**Data:**
- Open-Meteo Weather API
- Custom ski resort database (resorts-database.js)

---

## 📦 Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd idea

# Install dependencies
npm install

# Start the server
npm start
```

Server runs on **http://localhost:8080**

---

## 🌐 Deployment

This app is **free-hosting friendly**! Deploy to:

- **Render**: `render.yaml` ready
- **Railway**: One-click deploy
- **Vercel**: Serverless functions supported
- **Netlify**: Works with Netlify Functions

All you need is a Node.js environment. No databases, no API keys, no external dependencies!

---

## 🎮 Usage

### Controls
- **Drag**: Rotate the globe
- **Scroll**: Zoom in/out
- **Hover**: See region details
- **Click hotspot**: View resort list and snow stats
- **Reset View**: Bottom-right button returns to default view

### Auto-Rotation
- Globe auto-rotates by default
- Pauses for 30 seconds after any interaction (drag/zoom/hover)
- Resumes automatically

---

## 📁 Project Structure

```
idea/
├── server.js              # Node.js backend (API + static file serving)
├── resorts-database.js    # 180+ ski resorts with coordinates
├── package.json           # Dependencies
├── static/
│   ├── index.html         # Main HTML
│   ├── style.css          # Retro terminal styling
│   ├── app.js             # D3.js globe rendering + data fetching
│   └── map.jpg            # World map image (for reference)
└── README.md              # This file
```

---

## 🔧 Configuration

### Update Frequency
Change the refresh interval in `server.js`:

```javascript
setInterval(async () => {
    currentSnowData = await fetchRealSnowData();
}, 60 * 60 * 1000); // 1 hour (in milliseconds)
```

### Add More Resorts
Edit `resorts-database.js`:

```javascript
{ 
    name: "Your Resort", 
    coords: [lat, lon], 
    elevation: 2500, 
    region: "Your Region" 
}
```

### Customize Intensity Formula
Edit the calculation in `server.js`:

```javascript
const rawIntensity = (baseDepth * 0.35) + (newSnow24h * 2.5) + (newSnow7d * 0.7);
```

---

## 🐛 Known Limitations

1. **Base Depth Estimation**: Open-Meteo doesn't provide base depth, so we estimate it from recent snowfall
2. **Rate Limiting**: 100ms delay between API calls to avoid overwhelming Open-Meteo
3. **Seasonal Data**: Southern Hemisphere resorts show low values during Northern Hemisphere winter (and vice versa)
4. **No Historical Trends**: Currently only shows current + 7-day data

---

## 🚧 Future Enhancements

- [ ] Add historical snow charts (past 30 days)
- [ ] Filter by continent/country
- [ ] Search for specific resorts
- [ ] Compare multiple resorts side-by-side
- [ ] Email/SMS alerts for powder days
- [ ] Mobile-responsive design
- [ ] Dark/light theme toggle (keeping retro aesthetic)

---

## 📜 License

MIT License - feel free to use, modify, and deploy!

---

## 🙏 Credits

- **Weather Data**: [Open-Meteo](https://open-meteo.com)
- **Map Rendering**: [D3.js](https://d3js.org)
- **Resort Data**: Wikipedia, OpenStreetMap, official resort sources
- **Inspiration**: 1980's terminal aesthetics

---

## 📧 Contact

Built by **Wyler** | [GitHub](https://github.com/yourusername)

**Enjoy the powder! 🏂❄️**
