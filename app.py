"""
Flask API Server
Serves snow data and frontend for retro terminal visualization
"""
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from scraper import SnowDataScraper
from datetime import datetime
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# Initialize scraper
scraper = SnowDataScraper()

# Global data store
snow_data = {}

def update_snow_data():
    """Fetch and update snow data"""
    global snow_data
    snow_data = scraper.scrape_opensnow()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Snow data refreshed")

# Initialize scheduler for hourly updates
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_snow_data, trigger="interval", hours=1)
scheduler.start()

# Get initial data
update_snow_data()

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('static', 'index.html')

@app.route('/api/snow-data')
def get_snow_data():
    """API endpoint to get current snow data"""
    return jsonify(snow_data)

@app.route('/api/refresh')
def refresh_data():
    """Manually trigger a data refresh"""
    update_snow_data()
    return jsonify({"status": "success", "timestamp": snow_data.get("timestamp")})

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('static', path)

if __name__ == '__main__':
    # Ensure static directory exists
    os.makedirs('static', exist_ok=True)
    
    print("=" * 60)
    print("  SNOWMAP Terminal v1.0")
    print("  Retro Snow Visualization System")
    print("=" * 60)
    print(f"\n  Server starting on http://localhost:8080")
    print(f"  Data refresh: Every 60 minutes")
    print(f"  Press CTRL+C to stop\n")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=8080, debug=True, use_reloader=False)

