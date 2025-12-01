/**
 * SNOWMAP Terminal - 3D Globe Renderer
 * Interactive 3D globe with mouse rotation
 */

// Configuration
const width = window.innerWidth;
const height = window.innerHeight;

// Color scheme for intensity
const colorScheme = [
    { threshold: 0, color: '#001100', name: 'Minimal' },
    { threshold: 20, color: '#003300', name: 'Light' },
    { threshold: 40, color: '#00ff00', name: 'Moderate' },
    { threshold: 60, color: '#ffff00', name: 'Heavy' },
    { threshold: 80, color: '#ff6600', name: 'Extreme' },
    { threshold: 95, color: '#ff0000', name: 'Epic' }
];

// Set up SVG
const svg = d3.select("#world-map")
    .attr("width", width)
    .attr("height", height);

// Set up 3D orthographic projection (globe view)
// Initial scale 1.2x
const initialScale = (Math.min(width, height) / 2.2) * 1.2;
const projection = d3.geoOrthographic()
    .scale(initialScale)
    .translate([width / 2, height / 2])
    .clipAngle(90);

// Path generator
const pathGenerator = d3.geoPath().projection(projection);

// Store regions data
let regionsData = [];
let geoData = null;

// Rotation state
let rotation = { x: 0, y: 0 };
let currentScale = 1;

// Set up zoom behavior
const zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .on("start", function() {
        autoRotateEnabled = false;
        clearTimeout(window.rotateTimeout);
        hideTooltip(); // Hide tooltip when zooming/panning starts
    })
    .on("zoom", function(event) {
        const scale = event.transform.k;
        projection.scale(Math.min(width, height) / 2.2 * scale);
        
        // Update globe sphere
        svg.select(".globe-sphere")
            .attr("r", projection.scale());
        
        render();
    })
    .on("end", function() {
        window.rotateTimeout = setTimeout(() => {
            autoRotateEnabled = true;
        }, 30000);
    });

// Set up drag behavior for rotation
const drag = d3.drag()
    .on("start", function() {
        autoRotateEnabled = false;
        clearTimeout(window.rotateTimeout);
        hideTooltip(); // Hide tooltip when dragging starts
    })
    .on("drag", function(event) {
        const rotate = projection.rotate();
        // Invert rotation sensitivity based on zoom level to keep it natural
        const k = 75 / projection.scale();
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        render();
    })
    .on("end", function() {
        window.rotateTimeout = setTimeout(() => {
            autoRotateEnabled = true;
        }, 30000);
    });

// Apply behaviors to SVG
svg.call(drag).call(zoom);

// Add globe sphere background
svg.append("circle")
    .attr("class", "globe-sphere")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "none")
    .attr("stroke", "#00ff00")
    .attr("stroke-width", 2)
    .attr("opacity", 0.3);

// Container for countries
const countriesGroup = svg.append("g").attr("class", "countries");

// Container for hotspots
const hotspotsGroup = svg.append("g").attr("class", "hotspots");

// Load world map from public GeoJSON
const worldJsonUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

d3.json(worldJsonUrl).then(data => {
    geoData = data;
    
    // Draw initial countries
    countriesGroup.selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("class", "country");
    
    // Load snow data and render
    loadSnowData();
    render();
}).catch(error => {
    console.error("Error loading map:", error);
    alert("Could not load world map data");
});

// Load snow data from API
function loadSnowData() {
    fetch('/api/snow-data')
        .then(response => response.json())
        .then(data => {
            regionsData = data.regions;
            render();
            startAnimation();
        })
        .catch(error => console.error('Error loading snow data:', error));
}

// Get color for intensity
function getColorForIntensity(intensity) {
    for (let i = colorScheme.length - 1; i >= 0; i--) {
        if (intensity >= colorScheme[i].threshold) {
            return colorScheme[i];
        }
    }
    return colorScheme[0];
}

// Main render function
function render() {
    if (!geoData) return;
    
    // Update country paths
    countriesGroup.selectAll("path")
        .attr("d", pathGenerator);
    
    // Remove existing hotspots
    hotspotsGroup.selectAll(".hotspot-group").remove();
    
    // Render visible hotspots
    const hotspots = hotspotsGroup.selectAll(".hotspot-group")
        .data(regionsData)
        .enter()
        .append("g")
        .attr("class", "hotspot-group")
        .style("pointer-events", "all")
        .each(function(d) {
            const coords = [d.coords[0], d.coords[1]];
            const projected = projection(coords);
            
            // Check if point is visible (on front of globe)
            const isVisible = projected && d3.geoDistance(coords, projection.invert([width/2, height/2])) < Math.PI / 2;
            
            if (isVisible && projected) {
                const group = d3.select(this);
                const color = getColorForIntensity(d.intensity).color;
                
                // Define radial gradient for smooth look
                const gradientId = `grad-${d.name.replace(/\s+/g, '-')}`;
                const defs = svg.append("defs");
                const gradient = defs.append("radialGradient")
                    .attr("id", gradientId)
                    .attr("cx", "50%")
                    .attr("cy", "50%")
                    .attr("r", "50%")
                    .attr("fx", "50%")
                    .attr("fy", "50%");
                
                gradient.append("stop")
                    .attr("offset", "0%")
                    .style("stop-color", color)
                    .style("stop-opacity", 0.8);
                
                gradient.append("stop")
                    .attr("offset", "100%")
                    .style("stop-color", color)
                    .style("stop-opacity", 0);

                // Add large glow effect using gradient
                group.append("circle")
                    .attr("class", "hotspot-glow")
                    .attr("cx", projected[0])
                    .attr("cy", projected[1])
                    .attr("r", 30 + (d.intensity / 4)) // Larger smooth gradient
                    .style("fill", `url(#${gradientId})`);
                
                // Add main circle (core)
                const hotspot = group.append("circle")
                    .attr("class", "hotspot")
                    .attr("cx", projected[0])
                    .attr("cy", projected[1])
                    .attr("r", 4 + (d.intensity / 20))
                    .attr("fill", color)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 0.5)
                    .style("cursor", "pointer");
                
                // Add Text Label (Black text as requested)
                group.append("text")
                    .attr("class", "region-label")
                    .attr("x", projected[0])
                    .attr("y", projected[1] - 10) // Position slightly above
                    .text(d.name.split(" - ")[0]) // Simplified name
                    .style("font-size", "10px")
                    .style("fill", "#000000")
                    .style("font-weight", "bold")
                    // Make label visible if high intensity or zoomed in
                    .style("opacity", d.intensity > 60 || currentScale > 1.5 ? 1 : 0); 

                // Better event handling for tooltip
                let tooltipTimeout;
                
                hotspot.on("mouseenter", function(event) {
                    clearTimeout(tooltipTimeout);
                    d3.select(this.parentNode).select(".region-label").style("opacity", 1);
                    d3.select(this).attr("stroke", "#fff");
                    showTooltip(event, d);
                })
                .on("mouseleave", function(event) {
                    // Restore opacity state
                    if (!(d.intensity > 60 || currentScale > 1.5)) {
                        d3.select(this.parentNode).select(".region-label").style("opacity", 0);
                    }
                    d3.select(this).attr("stroke", "#000");
                    
                    // Only hide tooltip if not moving to tooltip itself
                    tooltipTimeout = setTimeout(() => {
                        hideTooltip();
                    }, 200);
                })
                .on("click", (event) => {
                    event.stopPropagation();
                    console.log("Clicked region:", d.name);
                });
            }
        });
}

// Animation for pulsing hotspots
function startAnimation() {
    function pulse() {
        hotspotsGroup.selectAll(".hotspot")
            .transition()
            .duration(1500)
            .attr("opacity", 0.7)
            .transition()
            .duration(1500)
            .attr("opacity", 0.9)
            .on("end", pulse);
    }
    pulse();
}

// Tooltip functions
function showTooltip(event, region) {
    const tooltip = document.getElementById('tooltip');
    const colorInfo = getColorForIntensity(region.intensity);
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${region.name}</div>
        <div class="tooltip-row">
            <span>Base Depth:</span>
            <span>${region.base_depth}"</span>
        </div>
        <div class="tooltip-row">
            <span>24h Snow:</span>
            <span>${region.new_snow_24h}"</span>
        </div>
        <div class="tooltip-row">
            <span>7d Snow:</span>
            <span>${region.new_snow_7d}"</span>
        </div>
        <div class="tooltip-row">
            <span>Intensity:</span>
            <span style="color: ${colorInfo.color}">${region.intensity} (${colorInfo.name})</span>
        </div>
        <div class="tooltip-row">
            <span>Resorts:</span>
            <span>${region.resort_count}</span>
        </div>
    `;
    
    tooltip.classList.remove('hidden');
    
    // Position tooltip using client coordinates
    const x = event.clientX + 15;
    const y = event.clientY + 15;
    const tooltipWidth = 220;
    const tooltipHeight = 200;
    
    // Keep within viewport bounds
    let finalX = x;
    let finalY = y;
    
    if (x + tooltipWidth > window.innerWidth) {
        finalX = event.clientX - tooltipWidth - 15;
    }
    
    if (y + tooltipHeight > window.innerHeight) {
        finalY = event.clientY - tooltipHeight - 15;
    }
    
    tooltip.style.left = finalX + 'px';
    tooltip.style.top = finalY + 'px';
    
    // Keep tooltip visible when hovering over it
    tooltip.onmouseenter = () => {
        clearTimeout(window.tooltipTimeout);
        autoRotateEnabled = false; // Stop rotation while reading
    };
    
    tooltip.onmouseleave = () => {
        hideTooltip();
        window.rotateTimeout = setTimeout(() => {
            autoRotateEnabled = true;
        }, 30000);
    };
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.add('hidden');
}

// Auto-rotate globe slowly
let autoRotateEnabled = true;
function autoRotate() {
    if (autoRotateEnabled) {
        const rotate = projection.rotate();
        projection.rotate([rotate[0] + 0.2, rotate[1]]);
        render();
    }
    requestAnimationFrame(autoRotate);
}

// Disable auto-rotate when user interacts with SVG (backup handler)
svg.on("mousedown", () => { 
    autoRotateEnabled = false; 
    clearTimeout(window.rotateTimeout);
});

// Start auto-rotation
autoRotate();

// Handle window resize
window.addEventListener('resize', () => {
    location.reload();
});

// Reset View Logic
document.getElementById('reset-btn').addEventListener('click', () => {
    // Target scale is 1.2x base scale
    const baseScale = Math.min(width, height) / 2.2;
    const targetScale = baseScale * 1.2;
    const zoomLevel = 1.2; // Corresponds to the scale multiplier
    
    // Reset projection to target state
    projection
        .scale(targetScale)
        .rotate([0, 0]);
    
    // Update sphere size
    svg.select(".globe-sphere")
        .attr("r", projection.scale());
    
    // Apply zoom transform cleanly to match the projection scale
    // We use d3.zoomIdentity.scale(zoomLevel) so future zooms start from 1.2x
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.scale(zoomLevel))
        .on("end", () => {
            // Force a render to ensure everything is aligned
            render();
            
            // Resume auto-rotation immediately
            autoRotateEnabled = true;
            clearTimeout(window.rotateTimeout);
            
            // Reset manual rotation state
            rotation = { x: 0, y: 0 };
        });
        
    render();
});

// Countdown Timer Logic
let nextUpdateTime = Date.now() + (60 * 60 * 1000);

function updateCountdown() {
    const now = Date.now();
    const diff = nextUpdateTime - now;
    
    if (diff <= 0) {
        nextUpdateTime = Date.now() + (60 * 60 * 1000);
        loadSnowData();
        return;
    }
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('countdown').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Auto-refresh data every hour
setInterval(() => {
    console.log('Auto-refreshing snow data...');
    loadSnowData();
    nextUpdateTime = Date.now() + (60 * 60 * 1000);
}, 60 * 60 * 1000);
