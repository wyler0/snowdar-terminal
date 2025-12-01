# SNOWMAP Terminal - Quick Start Guide

## 🚀 Getting Started (3 Steps)

### 1. Install Dependencies
```bash
cd ~/Desktop/projects/idea
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python app.py
```

You should see:
```
============================================================
  SNOWMAP Terminal v1.0
  Retro Snow Visualization System
============================================================

  Server starting on http://localhost:8080
  Data refresh: Every 60 minutes
  Press CTRL+C to stop

============================================================
```

### 3. Open Your Browser
Navigate to: **http://localhost:8080**

## 🎮 Using the Application

### Main Screen
- **World Map**: See all ski regions as glowing green hotspots
- **Legend**: Color intensity from green (low) to red (high)
- **Stats Panel**: Shows region count, average depth, and countdown

### Interactions
- **Hover**: Move mouse over hotspots to see tooltip with quick stats
- **Click**: Click hotspots to open detailed info panel with resort list
- **Wait**: Watch hotspots pulse and animate in real-time

### What You'll See
- 🟢 **Green Hotspots**: Low to moderate snow (0-60)
- 🟡 **Yellow Hotspots**: Heavy snow (60-80)
- 🔴 **Red Hotspots**: Extreme/Epic snow (80-100)

## 📍 Regions Covered

- 🇺🇸 Colorado Rockies (Vail, Breckenridge, Aspen...)
- 🇺🇸 Utah (Park City, Alta, Snowbird...)
- 🇺🇸 California Sierra (Palisades Tahoe, Mammoth...)
- 🇺🇸🇨🇦 Pacific Northwest (Whistler, Crystal Mountain...)
- 🇺🇸 Northeast (Stowe, Killington...)
- 🇨🇦 Canadian Rockies (Banff, Lake Louise...)
- 🇫🇷 French Alps (Chamonix, Val d'Isère...)
- 🇨🇭 Swiss Alps (Zermatt, Verbier...)
- 🇦🇹 Austrian Alps (St. Anton, Ischgl...)
- 🇯🇵 Japan (Niseko, Hakuba...)
- 🇳🇿 New Zealand (Queenstown, Wanaka...)
- 🇨🇱🇦🇷 South America (Valle Nevado, Las Leñas...)

## 🔧 Testing

Run automated tests:
```bash
python test_app.py
```

Expected output:
```
============================================================
  SNOWMAP TERMINAL - AUTOMATED TEST SUITE
============================================================

[TEST 1] Testing API endpoint... ✓
[TEST 2] Testing region data structure... ✓
[TEST 3] Testing static files... ✓
[TEST 4] Testing data validity... ✓
[TEST 5] Testing cache file... ✓

Tests Passed: 5/5
✓ ALL TESTS PASSED - SYSTEM OPERATIONAL
```

## 🛑 Stopping the Server

Press `CTRL+C` in the terminal where the server is running.

## 📊 API Endpoints

### Get Current Snow Data
```bash
curl http://localhost:8080/api/snow-data
```

### Force Manual Refresh
```bash
curl http://localhost:8080/api/refresh
```

## 🎨 Features Showcase

✅ **Retro Terminal Aesthetic**: Classic 80s green-on-black CRT look  
✅ **Scanline Effects**: Authentic terminal feel with moving scanlines  
✅ **Animated ASCII Art**: Loading screen with mountain graphics  
✅ **Interactive Map**: Click and hover for detailed information  
✅ **Auto-Refresh**: Data updates every 60 minutes automatically  
✅ **Live Countdown**: See time until next update  
✅ **Intensity Colors**: Visual indicators of snow levels  
✅ **12 Global Regions**: Worldwide ski resort coverage  

## 💡 Tips

- **Best viewed on desktop**: Larger screens show more detail
- **Chrome/Firefox recommended**: Best Canvas performance
- **Dark room**: Enhances the retro terminal vibe
- **Full screen (F11)**: Immersive experience

## 🐛 Troubleshooting

### Port 8080 already in use?
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Module not found error?
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Browser shows blank page?
- Check if server is running
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Check console for JavaScript errors (F12)

## 📁 File Structure

```
idea/
├── app.py              # 🚀 START HERE - Run this file
├── scraper.py         # Snow data generation
├── requirements.txt   # Python packages
├── static/
│   ├── index.html    # Main page
│   ├── style.css     # Retro styling
│   ├── map.js        # Map rendering
│   └── app.js        # App logic
└── test_app.py       # Automated tests
```

## 🎯 Next Steps

1. **Customize Regions**: Edit `RESORT_REGIONS` in `scraper.py`
2. **Change Colors**: Modify `colorScheme` in `static/map.js`
3. **Adjust Refresh**: Change interval in `app.py` (line 22)
4. **Add Resorts**: Expand resort lists in `scraper.py`

## 🌟 Enjoy!

You now have a fully functional retro terminal snow visualization system! 

Watch those hotspots pulse, explore regions worldwide, and embrace the 80s terminal aesthetic! 🏔️❄️🖥️

---

**Questions?** Check `README.md` and `PROJECT_SUMMARY.md` for more details.

