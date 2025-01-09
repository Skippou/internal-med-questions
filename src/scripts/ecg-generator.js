class ECGGenerator {
    constructor(svgElement) {
        this.svg = svgElement;
        this.pixelsPerMM = 5; // 5 pixels = 1mm
        this.timeScale = 25; // 25mm/s standard
        this.voltageScale = 10; // 10mm/mV standard
        this.leadPositions = {
            'I': [50, 50],
            'II': [50, 110],
            'III': [50, 170],
            'aVR': [50, 230],
            'aVL': [50, 290],
            'aVF': [50, 350],
            'V1': [250, 50],
            'V2': [250, 110],
            'V3': [250, 170],
            'V4': [250, 230],
            'V5': [250, 290],
            'V6': [250, 350]
        };
    }

    generateNormalSinus(startX, startY, heartRate = 75) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        // Calculate RR interval based on heart rate
        const rrInterval = (60 / heartRate) * this.timeScale * this.pixelsPerMM;
        
        // P wave
        let d = `M ${startX} ${startY}`;
        d += this.generatePWave(startX, startY);
        
        // PR segment
        d += this.generatePRSegment(startX + 20, startY);
        
        // QRS complex
        d += this.generateQRS(startX + 40, startY);
        
        // ST segment and T wave
        d += this.generateSTAndTWave(startX + 60, startY);
        
        path.setAttribute("d", d);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "1");
        path.setAttribute("fill", "none");
        
        return path;
    }

    generatePWave(x, y) {
        return ` q 5,-5 10,0 q 5,5 10,0`;
    }

    generatePRSegment(x, y) {
        return ` l 20,0`;
    }

    generateQRS(x, y) {
        return ` l -5,20 l 25,-40 l 5,20`;
    }

    generateSTAndTWave(x, y) {
        return ` l 20,0 q 10,-10 20,0 q 10,10 20,0`;
    }

    generateSTEMIPattern(x, y, amplitude = 4) {
        let d = `M ${x} ${y}`;
        d += ` l -5,20 l 25,-40 l 5,${20 - (amplitude * this.pixelsPerMM)} l 20,0 q 10,-10 20,0 q 10,10 20,0`;
        return d;
    }

    generateQWavePattern(x, y) {
        let d = `M ${x} ${y}`;
        d += ` l -10,30 l 25,-40 l 5,20 l 20,0 q 10,-10 20,0 q 10,10 20,0`;
        return d;
    }

    generateTWaveInversion(x, y) {
        let d = `M ${x} ${y}`;
        d += ` l -5,20 l 25,-40 l 5,20 l 20,0 q 10,10 20,0 q 10,-10 20,0`;
        return d;
    }

    generateSTDepression(x, y, amplitude = 2) {
        let d = `M ${x} ${y}`;
        d += ` l -5,20 l 25,-40 l 5,${20 + (amplitude * this.pixelsPerMM)} l 20,0 q 10,-10 20,0 q 10,10 20,0`;
        return d;
    }

    generateAFibPattern(x, y, type = 'normal') {
        let d = `M ${x} ${y}`;
        const baselineVariation = 2;
        const rrVariability = 15;
        
        // Generate 5 irregular QRS complexes
        for(let i = 0; i < 5; i++) {
            // Random baseline variation for fibrillatory waves
            const baseline = Math.random() * baselineVariation;
            // Random RR interval
            const rr = 50 + (Math.random() * rrVariability);
            
            switch(type) {
                case 'fast':
                    d += this.generateAFibQRS(x + (i * rr), y + baseline, 1.5);
                    break;
                case 'normal':
                    d += this.generateAFibQRS(x + (i * rr), y + baseline, 1.0);
                    break;
                case 'inverted':
                    d += this.generateInvertedAFibQRS(x + (i * rr), y + baseline);
                    break;
            }
        }
        return d;
    }

    generateAFibQRS(x, y, amplitude = 1.0) {
        const height = 20 * amplitude;
        return ` l -2,${height/4} l 4,-${height} l 2,${height*3/4}`;
    }

    generateInvertedAFibQRS(x, y) {
        return ` l 2,-5 l -4,20 l -2,-15`;
    }

    addWaveform(lead, heartRate) {
        const startPoints = {
            'I': [100, 30],
            'II': [100, 80],
            'III': [100, 130],
            'aVR': [100, 180],
            'aVL': [100, 230],
            'aVF': [100, 280],
            'V1': [350, 30],
            'V2': [350, 80],
            'V3': [350, 130],
            'V4': [350, 180],
            'V5': [350, 230],
            'V6': [350, 280]
        };

        const [x, y] = startPoints[lead];
        const waveform = this.generateNormalSinus(x, y, heartRate);
        this.svg.appendChild(waveform);
    }

    addCustomWaveform(lead, pattern, params = {}) {
        const [x, y] = this.leadPositions[lead] || [0, 0];
        let waveform;

        switch(pattern) {
            case 'stElevation4mm':
                waveform = this.generateSTEMIPattern(x, y, 4);
                break;
            case 'stElevation3mm':
                waveform = this.generateSTEMIPattern(x, y, 3);
                break;
            case 'qwave':
                waveform = this.generateQWavePattern(x, y);
                break;
            case 'tWaveInversion':
                waveform = this.generateTWaveInversion(x, y);
                break;
            case 'stDepression':
                waveform = this.generateSTDepression(x, y, 2);
                break;
            case 'afibFast':
                waveform = this.generateAFibPattern(x, y, 'fast');
                break;
            case 'afibNormal':
                waveform = this.generateAFibPattern(x, y, 'normal');
                break;
            case 'afibInverted':
                waveform = this.generateAFibPattern(x, y, 'inverted');
                break;
            default:
                waveform = this.generateNormalSinus(x, y, params.rate || 75);
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", waveform);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "1");
        path.setAttribute("fill", "none");
        path.setAttribute("class", "ecg-waveform");
        path.setAttribute("data-lead", lead);
        this.svg.appendChild(path);
    }

    // Add new method for rendering complete ECG
    renderFullECG(ecgData) {
        // Clear existing waveforms
        const existingWaveforms = this.svg.querySelectorAll('.ecg-waveform');
        existingWaveforms.forEach(w => w.remove());

        // Update measurements display
        document.getElementById('rate').textContent = ecgData.rate;
        document.getElementById('pr').textContent = ecgData.intervals.pr;
        document.getElementById('qrs').textContent = ecgData.intervals.qrs;
        document.getElementById('qt').textContent = ecgData.intervals.qt;

        // Generate waveforms for each lead
        Object.entries(ecgData.waveforms).forEach(([lead, pattern]) => {
            this.addCustomWaveform(lead, pattern, {
                rate: ecgData.rate,
                intervals: ecgData.intervals
            });
        });
    }

    // Add method for highlighting segments
    highlightSegment(lead, segment) {
        const waveform = this.svg.querySelector(`[data-lead="${lead}"]`);
        if (waveform) {
            waveform.classList.add('highlight');
            waveform.querySelector(`.${segment}`).classList.add('highlight');
        }
    }

    generateParamWave(startX, startY, samples = 100) {
        // Example param-based wave: combine sine waves for P, QRS, T
        // You can adjust these formulas for more realistic shapes
        const mmPerSample = 4; // Increase horizontal spacing
        let d = `M ${startX} ${startY}`;
        for (let i = 1; i <= samples; i++) {
            const x = startX + i * mmPerSample;
            // Combine wave components (simplified example)
            const p = 2 * Math.sin(i * 0.1);  // P wave
            const qrs = 5 * Math.sin(i * 0.5); // QRS
            const t = 3 * Math.sin((i - 50) * 0.07); // T wave
            const y = startY - (p + qrs + t);
            d += ` L ${x} ${y}`;
        }
        return d;
    }
}

// Usage example:
// const svg = document.querySelector('svg');
// const generator = new ECGGenerator(svg);
// generator.addWaveform('II', 75);
