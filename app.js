const ui = {
    wavesCount: document.getElementById('waves-count'),
    complexity: document.getElementById('complexity'),
    variability: document.getElementById('variability'),
    amplitude: document.getElementById('amplitude'),
    colorTop: document.getElementById('color-top'),
    colorBottom: document.getElementById('color-bottom'),
    useGradient: document.getElementById('use-gradient'),
    solidFill: document.getElementById('solid-fill'),
    posTop: document.getElementById('pos-top'),
    animTranslate: document.getElementById('anim-translate'),
    animDeform: document.getElementById('anim-deform'),
    deformSpeed: document.getElementById('deform-speed'),
    deformIntensity: document.getElementById('deform-intensity'),
    deformKeyframes: document.getElementById('deform-keyframes'),
    deformDesync: document.getElementById('deform-desync'),
    moveDirection: document.getElementById('move-direction'),
    speed: document.getElementById('speed'),
    container: document.getElementById('wave-container'),
    htmlCode: document.getElementById('html-code'),
    cssCode: document.getElementById('css-code'),
    btnCopyHtml: document.getElementById('btn-copy-html'),
    btnCopyCss: document.getElementById('btn-copy-css'),
    tabs: document.querySelectorAll('.tab'),
    toast: document.getElementById('toast'),
    btnRandomize: document.getElementById('btn-randomize')
};

let generationSeed = Math.floor(Math.random() * 1000000);
let currentSeed = generationSeed;

function randomFloat() {
    currentSeed += 1;
    let t = currentSeed + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// Utilities
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r:0, g:0, b:0};
}

function interpolateColor(color1, color2, factor) {
    let rgb1 = hexToRgb(color1);
    let rgb2 = hexToRgb(color2);
    let r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
    let g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
    let b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
    return `rgb(${r}, ${g}, ${b})`;
}

const updateValueDisplays = () => {
    document.getElementById('waves-count-val').textContent = ui.wavesCount.value;
    document.getElementById('complexity-val').textContent = ui.complexity.value;
    document.getElementById('variability-val').textContent = `${ui.variability.value}%`;
    document.getElementById('amplitude-val').textContent = `${ui.amplitude.value}px`;
    document.getElementById('deform-speed-val').textContent = `${ui.deformSpeed.value}s`;
    document.getElementById('deform-intensity-val').textContent = `${ui.deformIntensity.value}%`;
    document.getElementById('deform-keyframes-val').textContent = ui.deformKeyframes.value;
    document.getElementById('speed-val').textContent = `${ui.speed.value}s`;
};

// Math
function createBasePoints(pointsCount, amplitude, variability) {
    const baseWidth = 1000;
    const basePoints = [];
    const step = baseWidth / (pointsCount - 1);
    
    for (let i = 0; i < pointsCount - 1; i++) {
        let maxV = amplitude * (variability / 100);
        let y = 150 + ((randomFloat() - 0.5) * maxV * 2);
        basePoints.push({ x: i * step, y: y });
    }
    return basePoints;
}

function deformBasePoints(basePoints, amplitude, variability, intensity) {
    let newPoints = [];
    for (let i = 0; i < basePoints.length; i++) {
        let maxOffset = amplitude * (variability / 100) * (intensity / 100);
        let y = basePoints[i].y + ((randomFloat() - 0.5) * maxOffset * 2);
        newPoints.push({ x: basePoints[i].x, y: y });
    }
    return newPoints;
}

function createWavePathFromPoints(basePoints, isTranslating) {
    const baseWidth = 1000;
    const repetitions = isTranslating ? 2 : 1;
    const pts = [];
    for (let r = 0; r <= repetitions; r++) {
        for (let i = 0; i < basePoints.length; i++) {
            if (r === repetitions && i > 0) break;
            pts.push({ x: basePoints[i].x + r * baseWidth, y: basePoints[i].y });
        }
    }
    
    let d = `M ${pts[0].x} ${pts[0].y} `;
    for (let i = 0; i < pts.length - 1; i++) {
        let p1 = pts[i];
        let p2 = pts[i + 1];
        
        let p0 = i === 0 
            ? { x: basePoints[basePoints.length - 1].x - baseWidth, y: basePoints[basePoints.length - 1].y } 
            : pts[i - 1];
            
        let p3 = i === pts.length - 2 
            ? { x: basePoints[1].x + (repetitions * baseWidth), y: basePoints[1].y } 
            : pts[i + 2];
            
        let tension = 0.2; 
        
        let cp1x = p1.x + (p2.x - p0.x) * tension;
        let cp1y = p1.y + (p2.y - p0.y) * tension;
        let cp2x = p2.x - (p3.x - p1.x) * tension;
        let cp2y = p2.y - (p3.y - p1.y) * tension;
        
        d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
    }
    return d;
}

// Generate UI and Logic
function generateWave() {
    const wavesCount = parseInt(ui.wavesCount.value);
    const pointsCount = Math.max(3, parseInt(ui.complexity.value));
    const variability = parseInt(ui.variability.value);
    const amplitude = parseInt(ui.amplitude.value);
    
    const isTranslating = ui.animTranslate.checked;
    const isDeforming = ui.animDeform.checked;
    const deformSpeedBase = parseInt(ui.deformSpeed.value);
    const deformIntensity = parseInt(ui.deformIntensity.value);
    const deformKeyframes = parseInt(ui.deformKeyframes.value);
    const deformDesync = ui.deformDesync.checked;
    const moveDirection = ui.moveDirection.value;
    const posTop = ui.posTop.checked;
    
    const speed = parseInt(ui.speed.value);
    const useGradient = ui.useGradient.checked;
    const solidFill = ui.solidFill.checked;
    const colorTop = ui.colorTop.value;
    const colorBottom = ui.colorBottom.value;
    
    let htmlLines = [];
    let cssLines = [];
    
    htmlLines.push(`<div class="wave-wrap">`);
    htmlLines.push(`  <svg class="premium-wave" viewBox="0 0 1000 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">`);
    
    if (useGradient) {
        htmlLines.push(`  <defs>`);
        htmlLines.push(`    <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">`);
        htmlLines.push(`      <stop offset="0%" stop-color="${colorTop}" />`);
        htmlLines.push(`      <stop offset="100%" stop-color="${colorBottom}" />`);
        htmlLines.push(`    </linearGradient>`);
        htmlLines.push(`  </defs>`);
    }

    cssLines.push(`.wave-wrap {`);
    cssLines.push(`  width: 100%;`);
    cssLines.push(`  height: 300px; /* Adjust height as needed */`);
    cssLines.push(`  overflow: hidden;`);
    cssLines.push(`  position: relative;`);
    cssLines.push(`}`);
    
    cssLines.push(`.premium-wave {`);
    cssLines.push(`  width: 100%;`);
    cssLines.push(`  height: 100%;`);
    cssLines.push(`}`);

    for (let i = 0; i < wavesCount; i++) {
        currentSeed = generationSeed + i * 10000;
        
        // We want front wave (i = wavesCount-1) to have full opacity
        const fraction = wavesCount === 1 ? 1 : i / (wavesCount - 1);
        const opacity = wavesCount === 1 ? 1 : (0.4 + 0.6 * fraction).toFixed(2);
        
        let bp = createBasePoints(pointsCount, amplitude, variability);
        
        let d = createWavePathFromPoints(bp, isTranslating);
        let closeSuffix = "";
        
        if (solidFill) {
            let widthSpan = isTranslating ? 2000 : 1000;
            let closeY = posTop ? 0 : 300;
            closeSuffix = ` L ${widthSpan} ${closeY} L 0 ${closeY} Z`;
            d += closeSuffix;
        }
        
        const className = `wave-${i}`;
        const vectorEffect = !solidFill ? ` vector-effect="non-scaling-stroke"` : '';
        
        let animateTags = [];
        
        if (isTranslating) {
            const layerSpeed = speed + (wavesCount - 1 - i) * 3;
            let fromTranslate = moveDirection === 'left' ? "0 0" : "-1000 0";
            let toTranslate   = moveDirection === 'left' ? "-1000 0" : "0 0";
            animateTags.push(`    <animateTransform attributeName="transform" attributeType="XML" type="translate" from="${fromTranslate}" to="${toTranslate}" dur="${layerSpeed}s" repeatCount="indefinite" />`);
        }
        
        if (isDeforming) {
            let valuesArray = [d];
            for (let k = 0; k < deformKeyframes - 1; k++) {
                let d_morph = createWavePathFromPoints(deformBasePoints(bp, amplitude, variability, deformIntensity), isTranslating) + closeSuffix;
                valuesArray.push(d_morph);
            }
            valuesArray.push(d);
            const valuesStr = valuesArray.join('; ');
            
            let syncMultiplier = 1;
            if (deformDesync) {
                syncMultiplier = (1 + (wavesCount - 1 - i) * 0.1) * (0.8 + randomFloat() * 0.4);
            }
            
            const finalDeformSpeed = Math.max(1, deformSpeedBase * syncMultiplier).toFixed(1);
            animateTags.push(`    <animate attributeName="d" dur="${finalDeformSpeed}s" repeatCount="indefinite" values="${valuesStr}" />`);
        }
        
        if (animateTags.length > 0) {
            htmlLines.push(`  <path class="${className}" d="${d}"${vectorEffect}>`);
            htmlLines.push(animateTags.join('\n'));
            htmlLines.push(`  </path>`);
        } else {
            htmlLines.push(`  <path class="${className}" d="${d}"${vectorEffect} />`);
        }
        
        cssLines.push(`.${className} {`);
        
        if (useGradient) {
            cssLines.push(`  fill: url(#wave-grad);`);
            cssLines.push(`  opacity: ${opacity};`);
        } else {
            const hex = interpolateColor(colorTop, colorBottom, fraction);
            cssLines.push(`  fill: ${hex};`);
            cssLines.push(`  opacity: ${opacity};`);
        }
        
        if (!solidFill) {
            cssLines.push(`  fill: none;`);
            cssLines.push(`  stroke: ${useGradient ? `url(#wave-grad)` : interpolateColor(colorTop, colorBottom, fraction)};`);
            cssLines.push(`  stroke-width: 4px;`);
        }
        
        cssLines.push(`}`);
    }
    
    htmlLines.push(`  </svg>`);
    htmlLines.push(`</div>`);
    
    const finalHtml = htmlLines.join('\n');
    const finalCss = cssLines.join('\n');
    
    ui.container.innerHTML = `<style>${finalCss}</style>\n` + finalHtml;
    
    ui.htmlCode.querySelector('code').textContent = finalHtml;
    ui.cssCode.querySelector('code').textContent = finalCss;
}

// Bind Listeners
Object.values(ui).forEach(el => {
    if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT')) {
        el.addEventListener('input', () => {
            updateValueDisplays();
            generateWave();
        });
    }
});

function copyToClipboard(textEl) {
    navigator.clipboard.writeText(textEl.textContent).then(() => {
        ui.toast.classList.add('show');
        setTimeout(() => ui.toast.classList.remove('show'), 2000);
    });
}

ui.btnCopyHtml.addEventListener('click', () => copyToClipboard(ui.htmlCode.querySelector('code')));
ui.btnCopyCss.addEventListener('click', () => copyToClipboard(ui.cssCode.querySelector('code')));

ui.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        ui.tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.code-block').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

ui.btnRandomize.addEventListener('click', () => {
    generationSeed = Math.floor(Math.random() * 1000000);
    generateWave();
});

document.addEventListener('DOMContentLoaded', () => {
    updateValueDisplays();
    generateWave();
});
