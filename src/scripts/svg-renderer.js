class SVGRenderer {
    constructor(container) {
        this.container = container;
        this.svg = null;
        this.calipers = [];
        this.measurementMode = false;
    }

    async init(gridTemplatePath) {
        // Create SVG canvas with viewBox
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("viewBox", "0 0 500 400");
        this.svg.setAttribute("width", "100%");
        this.svg.style.border = "1px solid #ccc";
        
        // Load and insert the ECG grid template
        try {
            // Fetch the SVG grid directly
            const gridResponse = await fetch(gridTemplatePath);
            const gridText = await gridResponse.text();
            const parser = new DOMParser();
            const gridDoc = parser.parseFromString(gridText, 'image/svg+xml');
            const gridElements = gridDoc.documentElement.children;
            
            // Copy all elements from the grid template
            Array.from(gridElements).forEach(element => {
                this.svg.appendChild(element.cloneNode(true));
            });
            
            this.container.appendChild(this.svg);
        } catch (error) {
            console.error('Failed to load ECG grid:', error);
        }

        // Add event listeners for interactive features
        this.svg.addEventListener('click', this.handleClick.bind(this));
        this.svg.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleClick(event) {
        if (!this.measurementMode) return;
        
        const point = this.getMousePosition(event);
        if (this.calipers.length < 2) {
            this.addCaliper(point);
        }
    }

    handleMouseMove(event) {
        if (!this.measurementMode || this.calipers.length !== 1) return;
        
        const point = this.getMousePosition(event);
        this.updateTemporaryMeasurement(point);
    }

    getMousePosition(event) {
        const CTM = this.svg.getScreenCTM();
        return {
            x: (event.clientX - CTM.e) / CTM.a,
            y: (event.clientY - CTM.f) / CTM.d
        };
    }

    toggleMeasurementMode() {
        this.measurementMode = !this.measurementMode;
        if (!this.measurementMode) {
            this.clearMeasurements();
        }
    }

    clearMeasurements() {
        this.calipers = [];
        // Remove measurement lines and text
        const measurements = this.svg.querySelectorAll('.measurement');
        measurements.forEach(m => m.remove());
    }
}
