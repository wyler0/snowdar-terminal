# SNOWMAP Terminal v1.0 🏔️❄️

A retro terminal-style web application that visualizes global snow levels across major ski resort regions with an awesome 80s green terminal aesthetic.

## Features

- 🖥️ **Retro Terminal UI**: Classic green-on-black terminal look with scanline effects
- 🗺️ **Interactive World Map**: ASCII-style world map with pulsing hotspots
- 🎨 **Intensity-Based Coloring**: Hotspots colored by snow intensity
- 📊 **Real-time Data**: Auto-refreshes every hour
- 🎯 **Interactive Regions**: Click regions to see detailed snow data
- ⚡ **Animated ASCII Art**: Loading screens with retro ASCII animations
- 📍 **12 Global Regions**: Covering major ski areas worldwide

## Regions Covered

- Colorado Rockies (USA)
- Utah (USA)
- California Sierra (USA)
- Pacific Northwest (USA/Canada)
- Northeast (USA)
- Canadian Rockies
- European Alps (France, Switzerland, Austria)
- Japan
- New Zealand
- Chile/Argentina

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open your browser to:
```
http://localhost:8080
```

## Usage

- **View Map**: The main screen shows all regions as pulsing hotspots
- **Hover**: Hover over hotspots to see quick stats in a tooltip
- **Click**: Click hotspots to view detailed information in the side panel
- **Auto-Update**: Data refreshes automatically every 60 minutes

## Technology Stack

- **Backend**: Flask (Python)
- **Scraping**: BeautifulSoup4, Requests
- **Scheduling**: APScheduler
- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Styling**: Pure CSS with retro terminal effects

## Architecture

```
┌─────────────────────────────────────────┐
│         Flask Web Server (8080)         │
│  ┌───────────┐      ┌────────────────┐  │
│  │ Static    │      │  API Endpoints │  │
│  │ Frontend  │◄─────┤  /api/snow-data│  │
│  └───────────┘      └────────────────┘  │
│                            ▲             │
│                            │             │
│                     ┌──────┴──────┐      │
│                     │   Scraper   │      │
│                     │ (APScheduler)│      │
│                     └─────────────┘      │
└─────────────────────────────────────────┘
```

## Customization

- Modify `RESORT_REGIONS` in `scraper.py` to add/remove regions
- Adjust refresh interval in `app.py` (default: 1 hour)
- Change color scheme in `map.js` colorScheme array
- Customize ASCII art in `app.js` loading frames

## Future Enhancements

- Live scraping from opensnow.com
- Weather forecasts integration
- Historical data trends
- Mobile responsive design
- Export data as JSON/CSV

## License

MIT License - Feel free to use and modify!

---

**Built with ❄️ by retro terminal enthusiasts**

