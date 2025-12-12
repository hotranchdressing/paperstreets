// Google Sheets configuration
const SHEET_ID = '1_Szf2HEZgx8l5ro5phSEoS3qvRLOJEdtSNqyHJPcg2U';
const SHEET_NAME = 'Sheet1';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

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
        
        // Parse the response (it's JSON wrapped in a function call)
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
        }).filter(v => v.id); // Filter out empty rows
        
        return videos;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return [];
    }
}

// Calculate topic similarity between two videos (for proximity)
function topicSimilarity(topics1, topics2) {
    const set1 = new Set(topics1);
    const set2 = new Set(topics2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size; // Jaccard similarity
}

// Generate grid positions based on topic clustering
function generateGridPositions(videos) {
    const positions = [];
    const padding = 20;
    const baseSize = 200; // Base size for longest videos
    
    // Sort by duration (shortest first for positioning)
    const sortedVideos = [...videos].sort((a, b) => a.duration - b.duration);
    
    // Calculate sizes (inverse of duration)
    const maxDuration = Math.max(...videos.map(v => v.duration));
    const minDuration = Math.min(...videos.map(v => v.duration));
    
    sortedVideos.forEach((video, index) => {
        // Inverse sizing: shorter = bigger
        const normalizedDuration = (video.duration - minDuration) / (maxDuration - minDuration);
        const size = baseSize + (1 - normalizedDuration) * 150; // 200-350px range
        
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;
        
        if (index === 0) {
            // First video in center-ish
            x = window.innerWidth / 2 - size / 2;
            y = 100;
        } else {
            // Find position near similar videos
            const similarities = positions.map((pos, i) => ({
                index: i,
                similarity: topicSimilarity(video.topics, sortedVideos[i].topics)
            }));
            
            // Sort by similarity
            similarities.sort((a, b) => b.similarity - a.similarity);
            
            // Try to place near most similar video
            do {
                const nearIndex = Math.min(Math.floor(Math.random() * 3), similarities.length - 1);
                const nearPos = positions[similarities[nearIndex].index];
                
                // Random offset from similar video
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 200;
                x = nearPos.x + Math.cos(angle) * distance;
                y = nearPos.y + Math.sin(angle) * distance;
                
                // Keep within bounds
                x = Math.max(padding, Math.min(window.innerWidth - size - padding, x));
                y = Math.max(100, y);
                
                attempts++;
            } while (attempts < maxAttempts && checkOverlap(x, y, size, positions));
        }
        
        positions.push({ x, y, size, video });
    });
    
    return positions;
}

// Check if position overlaps with existing positions
function checkOverlap(x, y, size, positions) {
    const padding = 15;
    return positions.some(pos => {
        const dx = x - pos.x;
        const dy = y - pos.y;
        const minDist = (size + pos.size) / 2 + padding;
        return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
}

// Color palette for interviewees
const INTERVIEWEE_COLORS = {
    'kwesi': '#d4c5a9',      // warm sand
    'ena': '#b8c5b0',        // sage green
    'anamaria': '#c9b5b8',   // dusty rose
    'qiana': '#a8b8c5'       // soft slate
};

// Render floating grid
function renderFloatingGrid(positions) {
    const container = document.getElementById('floating-grid');
    container.innerHTML = '';
    
    // Calculate total height needed
    const maxY = Math.max(...positions.map(p => p.y + p.size));
    container.style.height = `${maxY + 100}px`;
    
    positions.forEach(({ x, y, size, video }) => {
        const tile = document.createElement('div');
        tile.className = 'video-tile';
        tile.style.left = `${x}px`;
        tile.style.top = `${y}px`;
        tile.style.width = `${size}px`;
        tile.style.height = `${size}px`;
        tile.style.backgroundColor = INTERVIEWEE_COLORS[video.interviewee] || '#e0e0e0';
        
        // Tile content
        tile.innerHTML = `
            <div class="tile-overlay">
                <div class="tile-title">${video.title}</div>
                <div class="tile-meta">
                    <div>${video.interviewee}</div>
                    <div>${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}</div>
                </div>
                <div class="tile-topics">${video.topics.slice(0, 3).join(', ')}</div>
            </div>
        `;
        
        // Click to open video
        tile.addEventListener('click', () => openVideo(video));
        
        container.appendChild(tile);
    });
}

// Open video in modal
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
    
    // Load and render responses
    setTimeout(() => {
        renderResponses(video.id);
        setupResponseControls(video.id);
    }, 0);
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('visible');
    
    // Clear iframe to stop video
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        iframe.src = iframe.src; // Reload iframe to stop playback
    }
}

// Set up response controls
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

// Response and moderation functions (from original script)
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
    
    const positions = generateGridPositions(videos);
    renderFloatingGrid(positions);
}

// Run on load
document.addEventListener('DOMContentLoaded', init);

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('video-modal');
    if (e.target === modal) {
        closeVideoModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});