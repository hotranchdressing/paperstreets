// Google Sheets configuration
const SHEET_ID = '1_Szf2HEZgx8l5ro5phSEoS3qvRLOJEdtSNqyHJPcg2U';
const SHEET_NAME = 'Sheet1';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

// Physics configuration
const PHYSICS = {
    damping: 0.95,           // Friction/air resistance
    repulsion: 50000,        // Force pushing tiles apart
    centerPull: 0.0005,      // Gentle pull toward screen center
    topicGravity: 0.3,       // Base attraction between similar topics
    minDistance: 150,        // Minimum spacing between tiles
    maxSpeed: 2,             // Maximum velocity
    timeStep: 1/60           // Physics update rate
};

// Convert Google Drive share URL to embed URL
function convertDriveUrl(shareUrl) {
    const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
        return {
            embedUrl: `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`,
            fileId: fileIdMatch[1]
        };
    }
    return {
        embedUrl: shareUrl,
        fileId: null
    };
}

// Fetch and parse Google Sheets data
async function fetchVideosFromSheet() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;
        
        const videos = rows.map(row => {
            const cells = row.c;
            const driveData = convertDriveUrl(cells[5]?.v || '');
            return {
                id: cells[0]?.v || '',
                interviewee: cells[1]?.v || '',
                topics: cells[2]?.v ? cells[2].v.split(',').map(t => t.trim()) : [],
                duration: parseInt(cells[3]?.v) || 0,
                title: cells[4]?.v || '',
                url: driveData.embedUrl,
                fileId: driveData.fileId
            };
        }).filter(v => v.id);
        
        return videos;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return [];
    }
}

// Calculate topic frequencies and gravity values
function calculateTopicGravity(videos) {
    const topicCounts = {};
    
    videos.forEach(video => {
        video.topics.forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
    });
    
    // More common topics = stronger gravity
    const maxCount = Math.max(...Object.values(topicCounts));
    const topicGravity = {};
    
    Object.keys(topicCounts).forEach(topic => {
        // Normalize: common topics (0.5-1.0), rare topics (0.2-0.5)
        const frequency = topicCounts[topic] / maxCount;
        topicGravity[topic] = 0.3 + (frequency * 0.7);
    });
    
    return topicGravity;
}

// Calculate topic centers (average position of all clips with that topic)
function calculateTopicCenters(particles, topicGravity) {
    const centers = {};
    const counts = {};
    
    // Initialize
    Object.keys(topicGravity).forEach(topic => {
        centers[topic] = { x: 0, y: 0 };
        counts[topic] = 0;
    });
    
    // Sum positions
    particles.forEach(p => {
        p.video.topics.forEach(topic => {
            centers[topic].x += p.x;
            centers[topic].y += p.y;
            counts[topic]++;
        });
    });
    
    // Average
    Object.keys(centers).forEach(topic => {
        if (counts[topic] > 0) {
            centers[topic].x /= counts[topic];
            centers[topic].y /= counts[topic];
        }
    });
    
    return centers;
}

// Create particle system
function createParticleSystem(videos, topicGravity) {
    const particles = [];
    const maxDuration = Math.max(...videos.map(v => v.duration));
    const minDuration = Math.min(...videos.map(v => v.duration));
    
    const viewWidth = window.innerWidth;
    const viewHeight = Math.max(2000, videos.length * 80);
    
    videos.forEach((video, index) => {
        // Inverse sizing: shorter = bigger
        const normalizedDuration = (video.duration - minDuration) / (maxDuration - minDuration);
        const size = 150 + (1 - normalizedDuration) * 200; // 150-350px range
        
        // Initial random position (will be organized by physics)
        const x = Math.random() * (viewWidth - size);
        const y = Math.random() * (viewHeight - size);
        
        particles.push({
            video,
            x,
            y,
            vx: 0,
            vy: 0,
            size,
            mass: size / 100, // Bigger tiles = more mass
            opacity: 1,
            scale: 1
        });
    });
    
    return particles;
}

// Physics update
function updatePhysics(particles, topicGravity, topicCenters, activeFilters) {
    const viewWidth = window.innerWidth;
    const viewHeight = document.getElementById('floating-grid').offsetHeight;
    
    particles.forEach((p, i) => {
        let fx = 0, fy = 0;
        
        // 1. Repulsion from other particles (personal space)
        particles.forEach((other, j) => {
            if (i === j) return;
            
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            if (dist < PHYSICS.minDistance) {
                const force = PHYSICS.repulsion / (dist * dist);
                fx += (dx / dist) * force;
                fy += (dy / dist) * force;
            }
        });
        
        // 2. Topic gravity - attraction to topic centers
        p.video.topics.forEach(topic => {
            if (!topicCenters[topic]) return;
            
            const center = topicCenters[topic];
            const dx = center.x - p.x;
            const dy = center.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const gravity = topicGravity[topic] || 0.5;
            
            // If this topic is filtered, increase gravity significantly
            const gravityMultiplier = activeFilters.has(topic) ? 5.0 : 1.0;
            
            const force = PHYSICS.topicGravity * gravity * gravityMultiplier * p.mass;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
        });
        
        // 3. Gentle pull toward screen center (prevents drifting off)
        const centerX = viewWidth / 2;
        const centerY = viewHeight / 2;
        const toCenterX = centerX - p.x;
        const toCenterY = centerY - p.y;
        fx += toCenterX * PHYSICS.centerPull;
        fy += toCenterY * PHYSICS.centerPull;
        
        // Update velocity
        p.vx += fx * PHYSICS.timeStep;
        p.vy += fy * PHYSICS.timeStep;
        
        // Apply damping
        p.vx *= PHYSICS.damping;
        p.vy *= PHYSICS.damping;
        
        // Limit max speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > PHYSICS.maxSpeed) {
            p.vx = (p.vx / speed) * PHYSICS.maxSpeed;
            p.vy = (p.vy / speed) * PHYSICS.maxSpeed;
        }
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Keep within bounds
        p.x = Math.max(50, Math.min(viewWidth - p.size - 50, p.x));
        p.y = Math.max(50, Math.min(viewHeight - p.size - 50, p.y));
        
        // Update opacity based on filters
        if (activeFilters.size > 0) {
            const hasActiveTopics = p.video.topics.some(t => activeFilters.has(t));
            p.opacity = hasActiveTopics ? 1.0 : 0.3;
            p.scale = hasActiveTopics ? 1.0 : 0.8;
        } else {
            p.opacity = 1.0;
            p.scale = 1.0;
        }
    });
}

// Render particles
function renderParticles(particles) {
    const container = document.getElementById('floating-grid');
    
    particles.forEach(p => {
        let tile = document.getElementById(`tile-${p.video.id}`);
        
        if (!tile) {
            // Create tile
            tile = document.createElement('div');
            tile.id = `tile-${p.video.id}`;
            tile.className = 'video-tile';
            tile.style.backgroundColor = INTERVIEWEE_COLORS[p.video.interviewee] || '#e0e0e0';
            
            tile.innerHTML = `
                <div class="tile-overlay">
                    <div class="tile-title">${p.video.title}</div>
                    <div class="tile-meta">
                        <div>${p.video.interviewee}</div>
                        <div>${Math.floor(p.video.duration / 60)}:${(p.video.duration % 60).toString().padStart(2, '0')}</div>
                    </div>
                    <div class="tile-topics">${p.video.topics.slice(0, 3).join(', ')}</div>
                </div>
            `;
            
            tile.addEventListener('click', () => openVideo(p.video));
            container.appendChild(tile);
        }
        
        // Update position and style
        tile.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.scale})`;
        tile.style.width = `${p.size}px`;
        tile.style.height = `${p.size}px`;
        tile.style.opacity = p.opacity;
    });
}

// Color palette
const INTERVIEWEE_COLORS = {
    'kwesi': '#d4c5a9',
    'ena': '#b8c5b0',
    'anamaria': '#c9b5b8',
    'qiana': '#a8b8c5'
};

// State
let particles = [];
let topicGravity = {};
let topicCenters = {};
let activeFilters = new Set();
let animationId = null;

// Animation loop
function animate() {
    topicCenters = calculateTopicCenters(particles, topicGravity);
    updatePhysics(particles, topicGravity, topicCenters, activeFilters);
    renderParticles(particles);
    animationId = requestAnimationFrame(animate);
}

// Build filter UI
function buildFilterUI(videos) {
    const allTopics = new Set();
    videos.forEach(v => v.topics.forEach(t => allTopics.add(t)));
    
    const filterContainer = document.getElementById('filter-controls');
    const sortedTopics = Array.from(allTopics).sort();
    
    filterContainer.innerHTML = `
        <div class="filter-label">Filter by topic:</div>
        <div class="filter-tags">
            ${sortedTopics.map(topic => `
                <button class="filter-tag" data-topic="${topic}">${topic}</button>
            `).join('')}
        </div>
        <button class="clear-filters" onclick="clearFilters()">Clear All</button>
    `;
    
    // Add click handlers
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            if (activeFilters.has(topic)) {
                activeFilters.delete(topic);
                btn.classList.remove('active');
            } else {
                activeFilters.add(topic);
                btn.classList.add('active');
            }
        });
    });
}

function clearFilters() {
    activeFilters.clear();
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Open video modal
function openVideo(video) {
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-video-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${video.title}</h2>
            <button class="close-modal" onclick="closeVideoModal()">×</button>
        </div>
        <iframe 
            src="${video.url}" 
            width="100%" 
            height="480"
            allow="autoplay"
            style="border: none; background: #000;">
        </iframe>
        <div class="modal-meta">
            <div><strong>${video.interviewee}</strong></div>
            <div class="modal-topics">${video.topics.join(' • ')}</div>
        </div>
        
        <div class="response-section">
            <div class="response-divider">
                <div class="response-list" id="${video.id}-responses"></div>
                
                <div class="response-input">
                    <textarea 
                        id="${video.id}-response-text" 
                        placeholder="Add to the conversation..."
                    ></textarea>
                    <button class="btn-primary" id="${video.id}-submit-response">Continue Chain</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('visible');
    
    setTimeout(() => {
        renderResponses(video.id);
        setupResponseControls(video.id);
    }, 0);
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('visible');
    
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        iframe.src = iframe.src;
    }
}

// Response system (from original)
let responses = {};

async function loadResponses() {
    try {
        const res = await fetch('/api/responses');
        if (res.ok) {
            responses = await res.json();
        }
    } catch (error) {
        console.error('Error loading responses:', error);
    }
}

function setupResponseControls(videoId) {
    const responseTextarea = document.getElementById(`${videoId}-response-text`);
    const submitResponseBtn = document.getElementById(`${videoId}-submit-response`);
    
    if (!responseTextarea || !submitResponseBtn) return;

    submitResponseBtn.addEventListener('click', async () => {
        const text = responseTextarea.value.trim();
        if (!text) return;

        submitResponseBtn.disabled = true;
        submitResponseBtn.textContent = 'Checking...';

        const isSafe = await moderateContent(text);
        
        if (isSafe) {
            await addResponse(videoId, text);
            responseTextarea.value = '';
            renderResponses(videoId);
        } else {
            alert('Your message was flagged for inappropriate content. Please revise.');
        }

        submitResponseBtn.disabled = false;
        submitResponseBtn.textContent = 'Continue Chain';
    });
}

async function addResponse(videoId, text) {
    const newResponse = { 
        text, 
        timestamp: new Date().toISOString() 
    };

    if (!responses[videoId]) {
        responses[videoId] = [];
    }
    responses[videoId].push(newResponse);

    try {
        await fetch('/api/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId, text })
        });
    } catch (error) {
        console.error('Error saving response:', error);
    }
}

async function moderateContent(text) {
    try {
        const response = await fetch('/api/moderate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        return data.safe;
    } catch (error) {
        console.error('Moderation error:', error);
        return true;
    }
}

function renderResponses(videoId) {
    const responsesList = document.getElementById(`${videoId}-responses`);
    if (!responsesList) return;
    
    const videoResponses = responses[videoId] || [];
    responsesList.innerHTML = '';

    videoResponses.forEach(response => {
        const responseItem = document.createElement('div');
        responseItem.className = 'response-item';
        responseItem.innerHTML = `
            <div class="response-timestamp">${new Date(response.timestamp).toLocaleString()}</div>
            <div class="response-text">${escapeHtml(response.text)}</div>
        `;
        responsesList.appendChild(responseItem);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
async function init() {
    await loadResponses();
    const videos = await fetchVideosFromSheet();
    console.log(`Loaded ${videos.length} videos from sheet`);
    
    topicGravity = calculateTopicGravity(videos);
    particles = createParticleSystem(videos, topicGravity);
    
    buildFilterUI(videos);
    
    // Set grid height
    const container = document.getElementById('floating-grid');
    container.style.height = `${Math.max(2000, videos.length * 80)}px`;
    
    // Start animation
    animate();
}

document.addEventListener('DOMContentLoaded', init);

// Modal close handlers
document.addEventListener('click', (e) => {
    const modal = document.getElementById('video-modal');
    if (e.target === modal) {
        closeVideoModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});