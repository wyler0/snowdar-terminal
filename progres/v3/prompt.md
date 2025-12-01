Here is a complete setup to build a custom, static map renderer. You will need three files in the same local folder: an HTML file, a CSS file, and a GeoJSON data file.
1. Download the Map Data (world.json)
First, you need the GeoJSON data file. This file contains all the coordinates for the country outlines. For this example, we will use a small, public domain file provided by the Natural Earth project.
Download a sample world GeoJSON file from a repository like GeoJSON Maps of the Globe: get the world.json or countries.geojson file and save it in the folder where you are building this project.
2. Create the HTML file (index.html)
This file contains the structure of the webpage, imports the D3.js library from a CDN, and includes the JavaScript code to load the data and draw the map in an SVG container.
html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Custom Static Map Renderer</title>
    <link rel="stylesheet" href="style.css">
    <!-- Load D3.js from a CDN -->
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
    <h1>Static World Map</h1>
    <!-- The SVG container where D3 will draw the map -->
    <svg id="map" width="960" height="500"></svg>

    <script src="map.js"></script>
</body>
</html>
Use code with caution.

3. Create the CSS file (style.css)
This file handles the visual styling of the map elements (the paths).
css
body {
    font-family: sans-serif;
    margin: 20px;
    background-color: #f0f0f0;
}

/* Style for the country outlines (SVG paths) */
path {
    stroke: #333; /* Dark outline color */
    stroke-width: 0.5px;
    fill: #B0C4DE; /* Light fill color */
    cursor: pointer; /* Makes it feel interactive */
    transition: fill 0.2s;
}

path:hover {
    fill: steelblue; /* Highlight on hover */
}
Use code with caution.

4. Create the JavaScript file (map.js)
This file contains the logic for D3.js to read your world.json file and render the map.
javascript
// Set up the dimensions and the SVG element
const width = 960;
const height = 500;
const svg = d3.select("#map");

// Define a map projection (Mercator is common)
// This converts latitude/longitude to X/Y coordinates
const projection = d3.geoMercator()
    .scale(150)
    .center([0, 20]) // Center the map roughly (longitude, latitude)
    .translate([width / 2, height / 2]);

// Create a path generator function that uses our projection
const pathGenerator = d3.geoPath()
    .projection(projection);

// Load the GeoJSON data from the local file
d3.json("world.json").then(data => {
    // Check the console for the structure of your data file
    console.log("Data loaded:", data); 

    // Bind the geographic data to SVG path elements
    svg.selectAll("path")
        .data(data.features) // Access the array of features in the GeoJSON
        .enter()
        .append("path")
        .attr("d", pathGenerator) // Use the path generator to define the 'd' attribute
        .attr("class", "country"); // Add a CSS class for styling
}).catch(error => {
    console.error("Error loading the GeoJSON data:", error);
    alert("Could not load world.json. Make sure the file is in the same folder and the file name matches.");
});
Use code with caution.

How to Run This
Place all three files (index.html, style.css, map.js) and your downloaded world.json in the same directory.
Open the index.html file in your web browser.
You now have a custom, static map renderer with full control over the SVG output!



