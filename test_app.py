#!/usr/bin/env python
"""
Test script to validate SNOWMAP Terminal functionality
"""
import requests
import json
import time
from datetime import datetime

def test_api_endpoint():
    """Test API endpoint is responding"""
    print("\n[TEST 1] Testing API endpoint...")
    try:
        response = requests.get('http://localhost:8080/api/snow-data', timeout=5)
        assert response.status_code == 200, "API returned non-200 status"
        data = response.json()
        assert 'regions' in data, "Missing 'regions' key in response"
        assert 'timestamp' in data, "Missing 'timestamp' key in response"
        assert len(data['regions']) > 0, "No regions in data"
        print("✓ API endpoint working correctly")
        print(f"  - Found {len(data['regions'])} regions")
        print(f"  - Timestamp: {data['timestamp']}")
        return True
    except Exception as e:
        print(f"✗ API test failed: {e}")
        return False

def test_region_data_structure():
    """Test region data has correct structure"""
    print("\n[TEST 2] Testing region data structure...")
    try:
        response = requests.get('http://localhost:8080/api/snow-data', timeout=5)
        data = response.json()
        
        required_fields = ['name', 'coords', 'base_depth', 'new_snow_24h', 
                          'new_snow_7d', 'intensity', 'resort_count', 'resorts']
        
        for region in data['regions']:
            for field in required_fields:
                assert field in region, f"Missing field '{field}' in region {region.get('name', 'unknown')}"
            
            # Validate data types
            assert isinstance(region['coords'], list) and len(region['coords']) == 2
            assert isinstance(region['base_depth'], (int, float))
            assert isinstance(region['intensity'], (int, float))
            assert isinstance(region['resorts'], list)
            
        print("✓ Region data structure valid")
        print(f"  - All {len(data['regions'])} regions have correct fields")
        return True
    except Exception as e:
        print(f"✗ Data structure test failed: {e}")
        return False

def test_static_files():
    """Test static files are accessible"""
    print("\n[TEST 3] Testing static files...")
    files = ['/', '/style.css', '/map.js', '/app.js']
    try:
        for file in files:
            response = requests.get(f'http://localhost:8080{file}', timeout=5)
            assert response.status_code in [200, 304], f"Failed to load {file}"
            print(f"  ✓ {file} - OK")
        print("✓ All static files accessible")
        return True
    except Exception as e:
        print(f"✗ Static files test failed: {e}")
        return False

def test_data_validity():
    """Test that data values are realistic"""
    print("\n[TEST 4] Testing data validity...")
    try:
        response = requests.get('http://localhost:8080/api/snow-data', timeout=5)
        data = response.json()
        
        for region in data['regions']:
            # Check reasonable ranges
            assert 0 <= region['intensity'] <= 100, f"Intensity out of range for {region['name']}"
            assert 0 <= region['base_depth'] <= 500, f"Base depth unrealistic for {region['name']}"
            assert region['resort_count'] == len(region['resorts']), f"Resort count mismatch for {region['name']}"
            
        print("✓ Data validity checks passed")
        print(f"  - All values within expected ranges")
        return True
    except Exception as e:
        print(f"✗ Data validity test failed: {e}")
        return False

def test_cache_file():
    """Test cache file exists and is readable"""
    print("\n[TEST 5] Testing cache file...")
    try:
        with open('snow_data_cache.json', 'r') as f:
            cache_data = json.load(f)
        assert 'regions' in cache_data
        assert 'timestamp' in cache_data
        print("✓ Cache file exists and is valid")
        print(f"  - Cache timestamp: {cache_data['timestamp']}")
        return True
    except Exception as e:
        print(f"✗ Cache file test failed: {e}")
        return False

def display_sample_data():
    """Display sample region data"""
    print("\n[SAMPLE DATA] First 3 regions:")
    try:
        response = requests.get('http://localhost:8080/api/snow-data', timeout=5)
        data = response.json()
        
        for i, region in enumerate(data['regions'][:3]):
            print(f"\n  Region {i+1}: {region['name']}")
            print(f"    Location: {region['coords']}")
            print(f"    Base Depth: {region['base_depth']}\"")
            print(f"    24h Snow: {region['new_snow_24h']}\"")
            print(f"    7d Snow: {region['new_snow_7d']}\"")
            print(f"    Intensity: {region['intensity']}")
            print(f"    Resorts: {', '.join(region['resorts'][:3])}...")
    except Exception as e:
        print(f"Could not display sample data: {e}")

def main():
    print("=" * 60)
    print("  SNOWMAP TERMINAL - AUTOMATED TEST SUITE")
    print("=" * 60)
    
    tests = [
        test_api_endpoint,
        test_region_data_structure,
        test_static_files,
        test_data_validity,
        test_cache_file
    ]
    
    results = []
    for test in tests:
        results.append(test())
        time.sleep(0.5)
    
    display_sample_data()
    
    print("\n" + "=" * 60)
    print("  TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"\n  Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("\n  ✓ ALL TESTS PASSED - SYSTEM OPERATIONAL")
    else:
        print("\n  ✗ SOME TESTS FAILED - CHECK LOGS ABOVE")
    
    print("\n" + "=" * 60)
    
    return passed == total

if __name__ == "__main__":
    exit(0 if main() else 1)

