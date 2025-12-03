/**
 * SNOWMAP Terminal - 3D Globe Renderer
 * Simplified interaction model
 */

// Configuration
const width = window.innerWidth;
const height = window.innerHeight;

// Color scheme for intensity
const colorScheme = [
    { threshold: 0, color: '#008800', name: 'Minimal' },
    { threshold: 5, color: '#00ff00', name: 'Light' },
    { threshold: 15, color: '#aaff00', name: 'Moderate' },
    { threshold: 25, color: '#ffff00', name: 'Good' },
    { threshold: 40, color: '#ff8800', name: 'Heavy' },
    { threshold: 60, color: '#ff0000', name: 'Epic' }
];

// Set up SVG
const svg = d3.select("#world-map")
    .attr("width", width)
    .attr("height", height);

// Set up 3D orthographic projection
const initialScale = (Math.min(width, height) / 2.2) * 1.2;
const projection = d3.geoOrthographic()
    .scale(initialScale)
    .translate([width / 2, height / 2])
    .clipAngle(90);

const pathGenerator = d3.geoPath().projection(projection);

// State
let regionsData = [];
let geoData = null;
let autoRotateEnabled = true;
let currentScale = 1;
let hoveredRegion = null;

// Tooltip element
const tooltip = document.getElementById('tooltip');

// Set up zoom behavior
const zoom = d3.zoom()
    .scaleExtent([0.5, 20])
    .on("start", () => {
        pauseAutoRotate();
        hideTooltip();
    })
    .on("zoom", (event) => {
        currentScale = event.transform.k;
        projection.scale(Math.min(width, height) / 2.2 * currentScale);
        svg.select(".globe-sphere").attr("r", projection.scale());
        render();
    })
    .on("end", () => {
        resumeAutoRotateDelayed();
    });

// Set up drag behavior
const drag = d3.drag()
    .on("start", () => {
        pauseAutoRotate();
        hideTooltip();
    })
    .on("drag", (event) => {
        const rotate = projection.rotate();
        const k = 75 / projection.scale();
        projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
        render();
    })
    .on("end", () => {
        resumeAutoRotateDelayed();
    });

svg.call(drag).call(zoom);

// Click on background to dismiss tooltip (for mobile)
svg.on("click", function(event) {
    if (hoveredRegion && event.target === this) {
        // Reset all highlights
        hotspotsGroup.selectAll(".hotspot-group").each(function() {
            const g = d3.select(this);
            g.select(".hotspot-ring").attr("opacity", 0.7);
            g.select(".region-label").style("opacity", 0);
        });
        hoveredRegion = null;
        hideTooltip();
        resumeAutoRotateDelayed();
    }
});

// Globe background
svg.append("circle")
    .attr("class", "globe-sphere")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "none")
    .attr("stroke", "#00ff00")
    .attr("stroke-width", 2)
    .attr("opacity", 0.3);

// Containers
const countriesGroup = svg.append("g").attr("class", "countries");
const hotspotsGroup = svg.append("g").attr("class", "hotspots");

// Load world map
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .then(data => {
        geoData = data;
        countriesGroup.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("class", "country");
        loadSnowData();
        render();
    });

// Load snow data
function loadSnowData() {
    fetch('/api/snow-data')
        .then(r => r.json())
        .then(data => {
            regionsData = data.regions.sort((a, b) => a.intensity - b.intensity);
            render();
        });
}

// Get color for intensity
function getColorForIntensity(intensity) {
    for (let i = colorScheme.length - 1; i >= 0; i--) {
        if (intensity >= colorScheme[i].threshold) return colorScheme[i];
    }
    return colorScheme[0];
}

// Main render function
function render() {
    if (!geoData) return;
    
    countriesGroup.selectAll("path").attr("d", pathGenerator);
    hotspotsGroup.selectAll("*").remove();
    
    // Scale factor: points get BIGGER when zoomed in, smaller when zoomed out
    // At zoom 1.0 = normal size, zoom 2.0 = 1.5x size, zoom 0.5 = 0.75x size
    const scaleFactor = Math.max(0.6, Math.min(2.5, 0.5 + currentScale * 0.5));
    
    regionsData.forEach(d => {
        const coords = [d.coords[0], d.coords[1]];
        const projected = projection(coords);
        const isVisible = projected && d3.geoDistance(coords, projection.invert([width/2, height/2])) < Math.PI / 2;
        
        if (!isVisible || !projected) return;
        
        const color = getColorForIntensity(d.intensity).color;
        const coreRadius = 3 * scaleFactor;
        const ringRadius = (6 + (d.intensity / 25)) * scaleFactor;
        
        const group = hotspotsGroup.append("g")
            .attr("class", "hotspot-group")
            .datum(d);
        
        // Outer ring
        group.append("circle")
            .attr("class", "hotspot-ring")
            .attr("cx", projected[0])
            .attr("cy", projected[1])
            .attr("r", ringRadius)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5 * scaleFactor)
            .attr("opacity", 0.7);
        
        // Core dot
        group.append("circle")
            .attr("class", "hotspot-core")
            .attr("cx", projected[0])
            .attr("cy", projected[1])
            .attr("r", coreRadius)
            .attr("fill", color);
        
        // Label (hidden by default)
        group.append("text")
            .attr("class", "region-label")
            .attr("x", projected[0])
            .attr("y", projected[1] - 12 * scaleFactor)
            .text(d.name.split(" - ")[0])
            .style("font-size", `${10 * scaleFactor}px`)
            .style("fill", "#00ff00")
            .style("text-shadow", "0 0 3px #000")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .style("opacity", 0)
            .style("pointer-events", "none");
        
        // Hit target - captures mouse AND touch events
        const hitTarget = group.append("circle")
            .attr("class", "hit-target")
            .attr("cx", projected[0])
            .attr("cy", projected[1])
            .attr("r", Math.max(20, 15 * scaleFactor)) // Minimum 20px for touch
            .attr("fill", "transparent")
            .style("cursor", "pointer");
        
        // Desktop: hover events
        hitTarget
            .on("mouseenter", function(event) {
                if (isTouchDevice) return; // Skip on touch devices
                selectRegion(d, group, scaleFactor, event);
            })
            .on("mouseleave", function() {
                if (isTouchDevice) return;
                deselectRegion(group, scaleFactor);
            })
            .on("mousemove", function(event) {
                if (hoveredRegion && !isTouchDevice) {
                    positionTooltip(event);
                }
            });
        
        // Mobile: click/tap to toggle
        hitTarget.on("click", function(event) {
            event.stopPropagation();
            
            if (hoveredRegion === d) {
                // Already selected, deselect
                deselectRegion(group, scaleFactor);
            } else {
                // Deselect previous if any
                if (hoveredRegion) {
                    hotspotsGroup.selectAll(".hotspot-group").each(function() {
                        const g = d3.select(this);
                        g.select(".hotspot-ring").attr("opacity", 0.7).attr("stroke-width", 1.5 * scaleFactor);
                        g.select(".region-label").style("opacity", 0);
                    });
                }
                // Select this one
                selectRegion(d, group, scaleFactor, event);
            }
        });
    });
}

// Detect touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Select a region (highlight + show tooltip)
function selectRegion(d, group, scaleFactor, event) {
    hoveredRegion = d;
    pauseAutoRotate();
    
    group.select(".hotspot-ring").attr("opacity", 1).attr("stroke-width", 2.5 * scaleFactor);
    group.select(".region-label").style("opacity", 1);
    group.raise();
    
    showTooltip(event, d);
}

// Deselect region (reset highlight + hide tooltip)
function deselectRegion(group, scaleFactor) {
    hoveredRegion = null;
    
    group.select(".hotspot-ring").attr("opacity", 0.7).attr("stroke-width", 1.5 * scaleFactor);
    group.select(".region-label").style("opacity", 0);
    
    hideTooltip();
    resumeAutoRotateDelayed();
}

// Tooltip functions
function showTooltip(event, region) {
    const colorInfo = getColorForIntensity(region.intensity);
    
    tooltip.innerHTML = `
        <div class="tooltip-title">${region.name}</div>
        <div class="tooltip-row"><span>90d Total:</span><span>${region.snow_90d}"</span></div>
        <div class="tooltip-row"><span>24h Snow:</span><span>${region.new_snow_24h}"</span></div>
        <div class="tooltip-row"><span>7d Snow:</span><span>${region.new_snow_7d}"</span></div>
        <div class="tooltip-row"><span>Intensity:</span><span style="color:${colorInfo.color}">${region.intensity} (${colorInfo.name})</span></div>
    `;
    
    tooltip.style.display = 'block';
    positionTooltip(event);
}

function positionTooltip(event) {
    // Handle both mouse and touch events
    let clientX, clientY;
    
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    
    let x = clientX + 15;
    let y = clientY + 15;
    
    // Keep in viewport
    if (x + 220 > window.innerWidth) x = clientX - 235;
    if (y + 180 > window.innerHeight) y = clientY - 195;
    
    // On mobile, position tooltip at top of screen if it would be off-screen
    if (isTouchDevice) {
        x = Math.max(10, Math.min(x, window.innerWidth - 230));
        y = Math.max(10, Math.min(y, window.innerHeight - 190));
    }
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

// Auto-rotate
let rotateTimeout = null;

function pauseAutoRotate() {
    autoRotateEnabled = false;
    if (rotateTimeout) clearTimeout(rotateTimeout);
}

function resumeAutoRotateDelayed() {
    if (rotateTimeout) clearTimeout(rotateTimeout);
    rotateTimeout = setTimeout(() => {
        if (!hoveredRegion) autoRotateEnabled = true;
    }, 30000);
}

function autoRotate() {
    if (autoRotateEnabled && !hoveredRegion) {
        const rotate = projection.rotate();
        projection.rotate([rotate[0] + 0.15, rotate[1]]);
        render();
    }
    requestAnimationFrame(autoRotate);
}
autoRotate();

// Reset View
document.getElementById('reset-btn').addEventListener('click', () => {
    const baseScale = Math.min(width, height) / 2.2;
    projection.scale(baseScale * 1.2).rotate([0, 0]);
    svg.select(".globe-sphere").attr("r", projection.scale());
    currentScale = 1.2;
    svg.call(zoom.transform, d3.zoomIdentity.scale(1.2));
    render();
    autoRotateEnabled = true;
});

// Countdown Timer
let nextUpdateTime = Date.now() + 3600000;

function updateCountdown() {
    const diff = nextUpdateTime - Date.now();
    if (diff <= 0) {
        nextUpdateTime = Date.now() + 3600000;
        loadSnowData();
        return;
    }
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('countdown').textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Auto-refresh hourly
setInterval(() => {
    loadSnowData();
    nextUpdateTime = Date.now() + 3600000;
}, 3600000);

// Resize
window.addEventListener('resize', () => location.reload());
