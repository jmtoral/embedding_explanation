document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initTab1();
    initTab2();
    initTab3();
    initTab4();
});

// --- Tab Navigation ---
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Trigger re-renders if necessary based on visible tab
            if (targetId === 'tab-distance') {
                renderCanvas();
            }
        });
    });
}

// --- Tab 1: Embeddings Compression ---
function initTab1() {
    const tokensSlider = document.getElementById('tokens-slider');
    const dimSlider = document.getElementById('dim-slider');
    const tokensValue = document.getElementById('tokens-value');
    const dimValue = document.getElementById('dim-value');
    const tokensSource = document.getElementById('tokens-source');
    const vectorDest = document.getElementById('vector-dest');

    const densityBar = document.getElementById('density-bar');
    const densityText = document.getElementById('density-text');
    const explanation = document.getElementById('embedding-explanation');

    function updateVis() {
        const tCount = parseInt(tokensSlider.value);
        const dCount = parseInt(dimSlider.value);

        tokensValue.textContent = tCount;
        dimValue.textContent = dCount;

        // Render source tokens (scaled down visually for performance)
        tokensSource.innerHTML = '';
        const displayTokens = Math.min(tCount, 400); // Max visual tokens
        for (let i = 0; i < displayTokens; i++) {
            const dot = document.createElement('div');
            dot.className = 'token-particle';
            // Randomize color slightly based on count to show 'noise'
            if (tCount > 400) {
                const hue = Math.floor(Math.random() * 360);
                dot.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
            } else if (tCount > 200) {
                const colors = ['#3b82f6', '#8b5cf6', '#10b981'];
                dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            } else {
                dot.style.backgroundColor = '#3b82f6';
            }
            tokensSource.appendChild(dot);
        }

        // Render vector destination
        vectorDest.innerHTML = '';
        const displayDim = Math.min(Math.max(Math.floor(dCount / 10), 10), 150);

        // Calculate expected ratio
        const ratio = tCount / dCount;

        for (let i = 0; i < displayDim; i++) {
            const cell = document.createElement('div');
            cell.className = 'vector-cell';

            // Format colors based on compression and noise
            if (ratio > 5) {
                // Too compressed -> chaotic colors
                const gray = Math.floor(Math.random() * 50 + 50);
                const redDistortion = Math.floor(Math.random() * 100);
                cell.style.backgroundColor = `rgba(${gray + redDistortion}, ${gray}, ${gray}, 0.8)`;
            } else if (ratio > 2) {
                // Saturated
                const r = 139 + Math.floor(Math.random() * 60 - 30);
                const g = 92 + Math.floor(Math.random() * 60 - 30);
                const b = 246 + Math.floor(Math.random() * 60 - 30);
                cell.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
            } else {
                // Clean vector
                cell.style.backgroundColor = `rgba(139, 92, 246, 0.8)`; // solid purple
            }
            vectorDest.appendChild(cell);
        }

        // Density classification
        if (ratio < 0.5) {
            densityBar.style.width = '20%';
            densityBar.style.background = '#10b981'; // Green
            densityText.textContent = "Baja (Muy Precisa)";
            densityText.style.color = '#10b981';
            explanation.innerHTML = "Muy pocos tokens para el tamaño del vector. Representación <strong>muy precisa y enfocada</strong>. Ideal para buscar conceptos específicos.";
        } else if (ratio < 2.5) {
            densityBar.style.width = '50%';
            densityBar.style.background = '#3b82f6'; // Blue
            densityText.textContent = "Equilibrada";
            densityText.style.color = '#3b82f6';
            explanation.innerHTML = "Buen equilibrio entre contexto y precisión. Las ideas principales se capturan de forma nítida en el vector.";
        } else if (ratio < 6) {
            densityBar.style.width = '80%';
            densityBar.style.background = '#f59e0b'; // Yellow/Orange
            densityText.textContent = "Saturada";
            densityText.style.color = '#f59e0b';
            explanation.innerHTML = "El contenedor empieza a llenarse de ideas distintas. El vector resultante es un <strong>promedio</strong> entre varios temas.";
        } else {
            densityBar.style.width = '100%';
            densityBar.style.background = '#ef4444'; // Red
            densityText.textContent = "Pérdida de Información (Ruido)";
            densityText.style.color = '#ef4444';
            explanation.innerHTML = "<strong>Dilución Semántica</strong>. Hay demasiada información mezclada. El proceso de embedding funciona, pero se pierde la precisión para búsquedas exactas.";
        }
    }

    tokensSlider.addEventListener('input', updateVis);
    dimSlider.addEventListener('input', updateVis);

    // Initial call
    updateVis();
}

// --- Tab 2: Vector Distance ---
let currentScenario = 'small';
let myChart;

function initTab2() {
    const smallBtn = document.querySelector('[data-scenario="small"]');
    const largeBtn = document.querySelector('[data-scenario="large"]');
    const canvas = document.getElementById('vector-canvas');
    const title = document.getElementById('scenario-title');
    const desc = document.getElementById('scenario-desc');

    smallBtn.addEventListener('click', () => {
        smallBtn.classList.add('active');
        largeBtn.classList.remove('active');
        currentScenario = 'small';
        title.textContent = "Alta Precisión (Chunks Pequeños)";
        desc.textContent = "Los chunks pequeños enfocan el significado. Al buscar, es fácil encontrar el documento exacto porque los vectores están bien diferenciados en el espacio.";
        renderCanvas();
    });

    largeBtn.addEventListener('click', () => {
        largeBtn.classList.add('active');
        smallBtn.classList.remove('active');
        currentScenario = 'large';
        title.textContent = "Dilución Semántica (Chunks Grandes)";
        desc.innerHTML = "Un chunk grande empaca múltiples temas juntos. El vector resultante se ubica en el centro (como un promedio), haciendo que la distancia hacia <em>cualquier</em> pregunta sea más o menos igual. <strong>Pierde resolución.</strong>";
        renderCanvas();
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        drawSearch(x, y);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (document.getElementById('tab-distance').classList.contains('active')) {
            renderCanvas();
        }
    });
}

function renderCanvas(searchX = null, searchY = null) {
    const canvas = document.getElementById('vector-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set internal resolution
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    const docs = [];

    if (currentScenario === 'small') {
        // Distinct clusters
        docs.push({ x: w * 0.15, y: h * 0.2, group: 'Frontend' });
        docs.push({ x: w * 0.25, y: h * 0.15, group: 'CSS/HTML' });

        docs.push({ x: w * 0.8, y: h * 0.8, group: 'BBDD' });
        docs.push({ x: w * 0.85, y: h * 0.75, group: 'SQL' });

        docs.push({ x: w * 0.15, y: h * 0.8, group: 'CI/CD' });
        docs.push({ x: w * 0.25, y: h * 0.85, group: 'Docker' });

        docs.push({ x: w * 0.85, y: h * 0.2, group: 'Agentes' });
        docs.push({ x: w * 0.8, y: h * 0.25, group: 'LLMs' });
    } else {
        // Large chunks average out towards the center
        docs.push({ x: w * 0.4, y: h * 0.4, group: 'Chunk 1 (Front/Back/DevOps)', isBig: true });
        docs.push({ x: w * 0.6, y: h * 0.5, group: 'Chunk 2 (AI/Data/Infra)', isBig: true });
        docs.push({ x: w * 0.5, y: h * 0.6, group: 'Chunk 3 (General Overview)', isBig: true });
    }

    // Save docs globally for click hit testing
    window.vectorDocs = docs;

    // Draw documents
    docs.forEach(d => {
        ctx.beginPath();
        if (d.isBig) {
            ctx.arc(d.x, d.y, 25, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
            ctx.fill();
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(d.group, d.x, d.y + 4);
        } else {
            ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#00f2fe';
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f2fe';

            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(d.group, d.x, d.y - 12);
        }
        ctx.shadowBlur = 0;
    });

    // Draw search query if exists
    if (searchX !== null && searchY !== null) {
        // Query dot
        ctx.beginPath();
        ctx.arc(searchX, searchY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ff007f'; // Pink
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Búsqueda", searchX, searchY - 15);

        // Find nearest
        let nearest = docs[0];
        let minDist = Infinity;
        docs.forEach(d => {
            const dist = Math.hypot(d.x - searchX, d.y - searchY);
            if (dist < minDist) {
                minDist = dist;
                nearest = d;
            }
        });

        // Draw line to nearest
        ctx.beginPath();
        ctx.moveTo(searchX, searchY);
        ctx.lineTo(nearest.x, nearest.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Highlight chosen document
        ctx.beginPath();
        if (nearest.isBig) {
            ctx.arc(nearest.x, nearest.y, 28, 0, Math.PI * 2);
        } else {
            ctx.arc(nearest.x, nearest.y, 12, 0, Math.PI * 2);
        }
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ff007f';
        ctx.font = 'bold 12px sans-serif';
        const midX = (searchX + nearest.x) / 2;
        const midY = (searchY + nearest.y) / 2;
        ctx.fillText(`Distancia: ${Math.round(minDist)}`, midX, midY - 10);
    }
}

function drawSearch(x, y) {
    if (document.getElementById('tab-distance').classList.contains('active')) {
        renderCanvas(x, y);
    }
}

// Ensure first render
setTimeout(() => {
    if (document.getElementById('tab-distance').classList.contains('active')) {
        renderCanvas();
    }
}, 500);

// --- Tab 3: ReAct Architecture ---
function initTab3() {
    const btnSmall = document.getElementById('run-react-small');
    const btnLarge = document.getElementById('run-react-large');
    const terminal = document.getElementById('terminal-output');

    // SVG Elements
    const dot = document.getElementById('flow-dot');
    const nodes = {
        user: document.querySelector('.user-node'),
        action: document.querySelector('.action-node'),
        obs: document.querySelector('.obs-node'),
        reason: document.querySelector('.reason-node')
    };

    function addLog(text, type = 'info') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = `> ${text}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function animateDot(pathId, duration) {
        return new Promise(resolve => {
            const path = document.getElementById(pathId);
            const length = path.getTotalLength();

            dot.style.opacity = '1';
            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;

                if (progress < 1) {
                    const point = path.getPointAtLength(progress * length);
                    dot.setAttribute('cx', point.x);
                    dot.setAttribute('cy', point.y);
                    window.requestAnimationFrame(step);
                } else {
                    const point = path.getPointAtLength(length);
                    dot.setAttribute('cx', point.x);
                    dot.setAttribute('cy', point.y);
                    resolve();
                }
            }
            window.requestAnimationFrame(step);
        });
    }

    function resetNodes() {
        Object.values(nodes).forEach(n => n.classList.remove('active'));
        terminal.innerHTML = '';
        dot.style.opacity = '0';
    }

    async function runSimulation(isLarge) {
        btnSmall.disabled = true;
        btnLarge.disabled = true;
        resetNodes();

        // Step 1: Query
        nodes.user.classList.add('active');
        addLog("Usuario pregunta: '¿En qué año se lanzó Coca-Cola Cherry y cuál es su ingrediente secreto?'", 'info');
        await sleep(500);

        // Move to Action
        await animateDot('path-1', 800);
        nodes.user.classList.remove('active');
        nodes.action.classList.add('active');
        addLog("Thought 1: Necesito buscar la fecha de lanzamiento y la receta de Cherry Coke.", 'info');
        addLog("Act 1: search('Lanzamiento Coca-Cola Cherry ingredientes')", 'info');
        await sleep(1000);

        // Move to Observation
        await animateDot('path-2', 800);
        nodes.action.classList.remove('active');
        nodes.obs.classList.add('active');

        if (isLarge) {
            // Large Chunk scenario
            addLog("Observation: [Recibido Chunk ruidoso de 1000 tokens]", 'warning');
            addLog(`"...The Coca-Cola Company, fundada en 1892, produce muchas bebidas. En 1985 lanzaron New Coke, un fracaso. 
            Ese mismo año, en 1985, introdujeron Coca-Cola Cherry con gran éxito. La vainilla se añadió años después. 
            Nuestra fábrica en Atlanta usa jarabe de maíz. El Dr. Pemberton usó extracto de hoja de coca, pero la receta secreta 
            actual 7X está guardada en una bóveda. Para Cherry Coke, usamos un concentrado especial de cereza negra importado..."`, 'warning');
        } else {
            // Small Chunk scenario
            addLog("Observation: [Recibido Chunk preciso de 100 tokens]", 'info');
            addLog(`"...Coca-Cola Cherry fue introducida al mercado estadounidense en 1985 en algunas ciudades prueba. 
            Aunque la fórmula base sigue siendo la clásica y secreta receta 7X, el sabor distintivo de iteración se logra 
            añadiendo un extracto propietario concentrado de cereza negra natural..."`, 'info');
        }
        await sleep(1500);

        // Move to Reason (Synthesis)
        await animateDot('path-3', 800);
        nodes.obs.classList.remove('active');
        nodes.reason.classList.add('active');

        addLog("Iniciando fase de Síntesis (LLM procesando todo el contexto recuperado)...", 'info');
        await sleep(1500);

        if (isLarge) {
            addLog("Thought 2: (Síntesis) Habla de 1892, 1985. New Coke fracasó. Cherry se lanzó en 1985. Habla de jarabe de maíz, extracto de coca y concentrado de cereza negra. La pregunta pide el ingrediente secreto. ¿Es la fórmula 7X, el jarabe de maíz o la cereza negra? Hay demasiado ruido.", 'error');
            addLog("Act 2: search('Cual es el ingrediente secreto exacto de Cherry Coke') /* Agente confundido por múltiples ingredientes y fechas */", 'error');

            await animateDot('path-return', 1000);
            nodes.reason.classList.remove('active');
            nodes.obs.classList.add('active');
            addLog("Observation: [Context missing]", 'error');
            addLog("FIN: El Agente entra en una espiral infinita o alucina que el ingrediente es hoja de coca.", 'error');
        } else {
            addLog("Thought 2: (Síntesis) El contexto indica que fue lanzada en 1985 y el ingrediente secreto es extracto concentrado de cereza negra.", 'info');
            addLog("Act 2: finish('Coca-Cola Cherry se lanzó en 1985 y su ingrediente distintivo es un extracto concentrado de cereza negra natural.')", 'info');
            addLog("FIN: El Agente razona bien y extrae los datos exactos.", 'info');
        }

        setTimeout(() => {
            btnSmall.disabled = false;
            btnLarge.disabled = false;
            nodes.user.classList.remove('active');
            nodes.action.classList.remove('active');
            nodes.obs.classList.remove('active');
            nodes.reason.classList.remove('active');
        }, 3000);
    }

    btnSmall.addEventListener('click', () => runSimulation(false));
    btnLarge.addEventListener('click', () => runSimulation(true));
}

// --- Tab 4: Cost Analysis ---
function initTab4() {
    const btns = document.querySelectorAll('.cost-btn, .scenario-btn[data-cost-scenario]');
    const totalChunks = document.getElementById('cost-chunks-total');
    const vectorSize = document.getElementById('cost-vector-size');
    const monthlyPrice = document.getElementById('cost-monthly-price');
    const hwMeter = document.getElementById('hardware-meter');
    const latMeter = document.getElementById('latency-meter');
    const conclusion = document.getElementById('cost-conclusion');

    // Add IDs for dynamic text updates not in original HTML but required by design change
    const hwVal = document.getElementById('hardware-val');
    const latVal = document.getElementById('latency-val');

    // Model: 100,000,000 tokens total in DB
    const TOTAL_TOKENS_DB = 100000000;

    // Pinecone rough estimate (Serverless) ->  ~$0.30 per 1M vectors read + storage costs.
    // For simplicity of explanation to non-technical folks, we use arbitrary but representative tiers.

    const scenarios = {
        'balanced': {
            tokens: 500, dim: 768, bytesPerDim: 4, label: 'Equilibrio (768 Dim / 500 Tokens)',
            hw: 35, lat: 40, hwText: 'Medio', latText: 'Media', price: '$250.00'
        },
        'expensive': {
            tokens: 100, dim: 1536, bytesPerDim: 4, label: 'Alto Costo (1536 Dim / 100 Tokens)',
            hw: 95, lat: 90, hwText: 'Muy Alto (Crítico)', latText: 'Lenta (Pesada)', price: '$2,450.00'
        },
        'cheap': {
            tokens: 1000, dim: 50, bytesPerDim: 4, label: 'Económico (50 Dim / 1000 Tokens)',
            hw: 5, lat: 5, hwText: 'Muy Bajo', latText: 'Ultra Rápida', price: '$12.50'
        }
    };

    function updateScenario(key) {
        const sc = scenarios[key];

        // Math
        const chunks = Math.ceil(TOTAL_TOKENS_DB / sc.tokens);
        const bytesPerVector = sc.dim * sc.bytesPerDim;
        const totalStorageMB = (chunks * bytesPerVector) / (1024 * 1024);

        // Update DOM
        totalChunks.textContent = new Intl.NumberFormat('en-US').format(chunks);
        vectorSize.textContent = `${new Intl.NumberFormat('en-US').format(Math.round(totalStorageMB))} MB`;
        monthlyPrice.textContent = sc.price;

        // Animation bars
        hwMeter.style.width = sc.hw + '%';
        latMeter.style.width = sc.lat + '%';

        // Update labels
        if (hwVal) hwVal.textContent = sc.hwText;
        if (latVal) latVal.textContent = sc.latText;

        // Colors based on severity
        const getColor = (val) => {
            if (val > 70) return '#ef4444'; // Red
            if (val > 30) return '#f59e0b'; // Yellow/Orange
            return '#10b981'; // Green
        };

        hwMeter.style.background = getColor(sc.hw);
        latMeter.style.background = getColor(sc.lat);
        if (hwVal) hwVal.style.color = getColor(sc.hw);
        if (latVal) latVal.style.color = getColor(sc.lat);

        if (key === 'expensive') {
            conclusion.innerHTML = "<strong>Extremo Preciso:</strong> Un chunk muy pequeño (100) genera <strong>1 millón de vectores</strong>. Al usar un modelo LLM de embeddings grande (1536 dimensiones), la RAM y los costos en Pinecone se <strong style='color:#ef4444'>esconden exponencialmente</strong>.";
        } else if (key === 'cheap') {
            conclusion.innerHTML = "<strong>Ahorro Extremo:</strong> Generarás muy pocos vectores, y son pequeñitos. El costo es bajísimo. <strong>Trade-off:</strong> La precisión semántica se arruina; la vector DB dirá que 'Sprite' y 'Fanta' son lo mismo.";
        } else {
            conclusion.innerHTML = "<strong>Balance Inteligente:</strong> Chunks manejables (500) y modelos intermedios (768). Mantiene costos de nube predecibles sin colapsar la memoria, aislando los conceptos de negocio de manera aceptable.";
        }
    }

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateScenario(btn.getAttribute('data-cost-scenario'));
        });
    });

    // Initial call
    updateScenario('balanced');
}
