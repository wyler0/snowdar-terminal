/**
 * World Map Renderer with accurate coastline data
 * Draws world map with hotspots in retro terminal style
 */

class WorldMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.regions = [];
        this.hoveredRegion = null;
        this.mapImage = null;
        this.mapLoaded = false;
        
        // Color scheme for intensity
        this.colorScheme = [
            { threshold: 0, color: '#001100', name: 'Minimal' },
            { threshold: 20, color: '#003300', name: 'Light' },
            { threshold: 40, color: '#00ff00', name: 'Moderate' },
            { threshold: 60, color: '#ffff00', name: 'Heavy' },
            { threshold: 80, color: '#ff6600', name: 'Extreme' },
            { threshold: 95, color: '#ff0000', name: 'Epic' }
        ];
        
        this.loadMapImage();
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    loadMapImage() {
        this.mapImage = new Image();
        this.mapImage.onload = () => {
            this.mapLoaded = true;
            this.render();
        };
        this.mapImage.src = 'world-map.jpg';
    }
    
    setupCanvas() {
        // Fixed canvas size for consistent coordinate mapping
        const resizeCanvas = () => {
            // Use 16:9 aspect ratio or full screen
            const windowAspect = window.innerWidth / window.innerHeight;
            
            if (windowAspect > 16/9) {
                // Window is wider
                this.canvas.height = window.innerHeight;
                this.canvas.width = this.canvas.height * (16/9);
            } else {
                // Window is taller
                this.canvas.width = window.innerWidth;
                this.canvas.height = this.canvas.width / (16/9);
            }
            
            this.render();
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.hoveredRegion = this.getRegionAt(x, y);
            this.render();
            this.updateTooltip(e.clientX, e.clientY);
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.hoveredRegion = null;
            this.render();
            this.hideTooltip();
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.hoveredRegion) {
                console.log('Clicked region:', this.hoveredRegion.name);
            }
        });
    }
    
    updateRegions(regions) {
        this.regions = regions;
        this.render();
    }
    
    latLonToCanvas(lon, lat) {
        // Standard Equirectangular (Plate Carrée) projection
        // This map appears to use this projection with standard bounds
        
        if (!this.mapWidth || !this.mapHeight) {
            // Fallback before map is loaded
            return { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        }
        
        // Standard equirectangular projection
        // Longitude -180 to 180 maps linearly to 0 to mapWidth
        // Latitude 90 to -90 maps linearly to 0 to mapHeight
        
        // Normalize to 0-1 range
        const normalizedX = (lon + 180) / 360;
        const normalizedY = (90 - lat) / 180;
        
        // Apply to actual map dimensions
        const x = this.mapOffsetX + (normalizedX * this.mapWidth);
        const y = this.mapOffsetY + (normalizedY * this.mapHeight);
        
        return { x, y };
    }
    
    drawWorldOutline() {
        const ctx = this.ctx;
        
        if (!this.mapLoaded || !this.mapImage) {
            return;
        }
        
        // Calculate dimensions to fit canvas
        const imgAspect = this.mapImage.width / this.mapImage.height;
        const canvasAspect = this.canvas.width / this.canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasAspect > imgAspect) {
            drawWidth = this.canvas.width;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (this.canvas.height - drawHeight) / 2;
        } else {
            drawHeight = this.canvas.height;
            drawWidth = drawHeight * imgAspect;
            offsetX = (this.canvas.width - drawWidth) / 2;
            offsetY = 0;
        }
        
        // Store dimensions for coordinate conversion
        this.mapOffsetX = offsetX;
        this.mapOffsetY = offsetY;
        this.mapWidth = drawWidth;
        this.mapHeight = drawHeight;
        
        // Draw the inverted image (black background, green foreground)
        ctx.save();
        
        // Create a temporary canvas to process the image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.mapImage.width;
        tempCanvas.height = this.mapImage.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw the original image
        tempCtx.drawImage(this.mapImage, 0, 0);
        
        // Get image data and convert to green
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Calculate brightness
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            // If pixel is dark (lines/borders), make it green
            if (brightness < 200) {
                data[i] = 0;           // R
                data[i + 1] = 255;     // G
                data[i + 2] = 0;       // B
                data[i + 3] = Math.min(255, 255 - brightness);  // More visible for darker pixels
            } else {
                // Light pixel (background) -> make transparent
                data[i + 3] = 0;
            }
        }
        
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw the processed image to the main canvas
        ctx.drawImage(tempCanvas, offsetX, offsetY, drawWidth, drawHeight);
        
        ctx.restore();
    }
    
    getColorForIntensity(intensity) {
        for (let i = this.colorScheme.length - 1; i >= 0; i--) {
            if (intensity >= this.colorScheme[i].threshold) {
                return this.colorScheme[i];
            }
        }
        return this.colorScheme[0];
    }
    
    drawHotspot(region, isHovered = false) {
        const ctx = this.ctx;
        const pos = this.latLonToCanvas(region.coords[0], region.coords[1]);
        const colorInfo = this.getColorForIntensity(region.intensity);
        
        // Smaller hotspots with subtle pulse
        const baseSize = 6 + (region.intensity / 15);
        const time = Date.now() / 1000;
        const pulse = Math.sin(time * 1.5 + region.intensity) * 0.15 + 1;
        const size = baseSize * (isHovered ? 1.4 : 1) * pulse;
        
        // Draw glow
        ctx.globalAlpha = 0.6;
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 3);
        gradient.addColorStop(0, colorInfo.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(pos.x - size * 3, pos.y - size * 3, size * 6, size * 6);
        
        // Draw core
        ctx.globalAlpha = isHovered ? 1 : 0.9;
        ctx.fillStyle = colorInfo.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw selection ring for hovered
        if (isHovered) {
            ctx.globalAlpha = 0.9;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size + 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    getRegionAt(x, y) {
        for (const region of this.regions) {
            const pos = this.latLonToCanvas(region.coords[0], region.coords[1]);
            const distance = Math.sqrt(
                Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
            );
            
            const hitRadius = 15 + (region.intensity / 10);
            if (distance < hitRadius) {
                return region;
            }
        }
        return null;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw world outline
        this.drawWorldOutline();
        
        // Draw hotspots (non-hovered first)
        this.regions.forEach(region => {
            if (region !== this.hoveredRegion) {
                this.drawHotspot(region, false);
            }
        });
        
        // Draw hovered region last (on top)
        if (this.hoveredRegion) {
            this.drawHotspot(this.hoveredRegion, true);
        }
    }
    
    updateTooltip(mouseX, mouseY) {
        const tooltip = document.getElementById('tooltip');
        
        if (!this.hoveredRegion) {
            this.hideTooltip();
            return;
        }
        
        const region = this.hoveredRegion;
        const colorInfo = this.getColorForIntensity(region.intensity);
        
        tooltip.innerHTML = `
            <div class="tooltip-title">${region.name}</div>
            <div class="tooltip-row">
                <span>90d Total:</span>
                <span>${region.snow_90d}"</span>
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
        tooltip.style.left = (mouseX + 15) + 'px';
        tooltip.style.top = (mouseY + 15) + 'px';
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.classList.add('hidden');
    }
    
    // Animation loop for pulsing hotspots
    startAnimation() {
        const animate = () => {
            this.render();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }
    
    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}
