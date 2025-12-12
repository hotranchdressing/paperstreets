// Google Sheets configuration
const SHEET_ID = '1_Szf2HEZgx8l5ro5phSEoS3qvRLOJEdtSNqyHJPcg2U';
const SHEET_NAME = 'Sheet1';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

// GIF configuration - add your GIFs here
const YOUR_GIFS = [
    { 
        id: 'gif1',
        url: 'assets/callalloo.gif',
        frames: 60, // approximate number of frames in your GIF
        text: 'Your interpretive text here'
    }
    // Add more of your GIFs
];

const STUDENT_GIFS = [
    {
        id: 'sgif1',
        url: 'assets/garlic.gif',
        frames: 60,
        text: 'Student interpretation here'
    }
    // Add more student GIFs
];

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

// Fetch videos from Google Sheets
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

// Calculate topic similarity for clustering
function topicSimilarity(topics1, topics2) {
    const set1 = new Set(topics1);
    const set2 = new Set(topics2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

// Organize videos by topic clusters
function organizeByTopics(videos) {
    const organized = [];
    const used = new Set();
    
    videos.forEach((video, idx) => {
        if (used.has(idx)) return;
        
        const cluster = [video];
        used.add(idx);
        
        // Find similar videos
        videos.forEach((other, otherIdx) => {
            if (used.has(otherIdx)) return;
            if (topicSimilarity(video.topics, other.topics) > 0.3) {
                cluster.push(other);
                used.add(otherIdx);
            }
        });
        
        organized.push(cluster);
    });
    
    return organized;
}

// Color palette
const INTERVIEWEE_COLORS = {
    'qiana': '#a8b8c5',
    'anamaria': '#c9b5b8',
    'ena': '#b8c5b0',
    'kwesi': '#d4c5a9'
};

const FORMAL_NAMES = {
    'qiana': 'Qiana Mickie',
    'anamaria': 'Dr. Anamaría Flores',
    'ena': 'Ms. Ena K. McPherson',
    'kwesi': 'Kwesi Joseph, MBA'
};

// Render horizontal grid
function renderHorizontalGrid(videoClusters) {
    const container = document.getElementById('video-container');
    container.innerHTML = '';
    
    let xOffset = 100; // Start position
    
    videoClusters.forEach((cluster, clusterIdx) => {
        const clusterDiv = document.createElement('div');
        clusterDiv.className = 'video-cluster';
        clusterDiv.style.left = `${xOffset}px`;
        
        cluster.forEach((video, idx) => {
            const tile = createVideoTile(video, idx);
            clusterDiv.appendChild(tile);
        });
        
        container.appendChild(clusterDiv);
        
        // Space between clusters
        xOffset += 400 + (cluster.length * 50);
    });
    
    // Set total width for horizontal scroll
    container.style.width = `${xOffset + 200}px`;
}

// Create video tile
function createVideoTile(video, positionInCluster) {
    const maxDuration = 319; // From your data
    const minDuration = 13;
    const normalizedDuration = (video.duration - minDuration) / (maxDuration - minDuration);
    const size = 150 + (1 - normalizedDuration) * 200; // 150-350px
    
    const tile = document.createElement('div');
    tile.className = 'video-tile';
    tile.style.width = `${size}px`;
    tile.style.height = `${size}px`;
    tile.style.backgroundColor = INTERVIEWEE_COLORS[video.interviewee] || '#e0e0e0';
    
    // Vertical offset within cluster
    tile.style.top = `${positionInCluster * 80}px`;
    
    const displayName = FORMAL_NAMES[video.interviewee] || video.interviewee;
    
    tile.innerHTML = `
        <div class="tile-overlay">
            <div class="tile-title">${video.title}</div>
            <div class="tile-meta">
                <div>${displayName}</div>
                <div>${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}</div>
            </div>
            <div class="tile-topics">${video.topics.slice(0, 3).join(', ')}</div>
        </div>
    `;
    
    tile.addEventListener('click', () => openVideo(video));
    
    return tile;
}

// Render GIFs with scroll scrubbing
function renderScrollGIFs() {
    const container = document.getElementById('gif-layer');
    container.innerHTML = '';
    
    // Your GIFs - larger, positioned strategically
    YOUR_GIFS.forEach((gif, idx) => {
        const gifEl = createScrollGIF(gif, 'your-gif', idx * 800 + 300, 100);
        container.appendChild(gifEl);
    });
    
    // Student GIFs - smaller, scattered
    STUDENT_GIFS.forEach((gif, idx) => {
        const gifEl = createScrollGIF(gif, 'student-gif', idx * 600 + 500, 400);
        container.appendChild(gifEl);
    });
}

function createScrollGIF(gifData, className, xPos, yPos) {
    const wrapper = document.createElement('div');
    wrapper.className = `gif-wrapper ${className}`;
    wrapper.style.left = `${xPos}px`;
    wrapper.style.top = `${yPos}px`;
    wrapper.dataset.frames = gifData.frames;
    wrapper.dataset.gifId = gifData.id;
    
    const img = document.createElement('img');
    img.src = gifData.url;
    img.className = 'scroll-gif';
    
    wrapper.appendChild(img);
    
    // Click to toggle text
    wrapper.addEventListener('click', () => {
        if (wrapper.classList.contains('showing-text')) {
            wrapper.classList.remove('showing-text');
            wrapper.innerHTML = '';
            wrapper.appendChild(img);
        } else {
            wrapper.classList.add('showing-text');
            wrapper.innerHTML = `<div class="gif-text">${gifData.text}</div>`;
        }
    });
    
    return wrapper;
}

// Handle horizontal scroll and GIF scrubbing
let lastScrollX = 0;

function handleScroll() {
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollDelta = scrollX - lastScrollX;
    lastScrollX = scrollX;
    
    // Update GIF frames based on scroll position
    document.querySelectorAll('.gif-wrapper').forEach(wrapper => {
        const frames = parseInt(wrapper.dataset.frames) || 20;
        const img = wrapper.querySelector('.scroll-gif');
        
        if (img) {
            // Calculate which frame to show based on scroll position
            // This is a simplified version - actual implementation would need
            // to extract individual frames from the GIF
            const scrollProgress = scrollX / 100;
            const currentFrame = Math.floor(scrollProgress % frames);
            
            // For now, rotate the GIF slightly based on scroll
            // (Real implementation would show actual frames)
            const rotation = (scrollProgress * 5) % 360;
            img.style.transform = `rotate(${rotation}deg)`;
        }
    });
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
}

function clearFilters() {
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.video-tile').forEach(tile => {
        tile.style.opacity = '1';
        tile.style.transform = tile.style.transform.replace(/scale\([^)]*\)/, 'scale(1)');
    });
}

// Video modal
function openVideo(video) {
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-video-content');
    
    const displayName = FORMAL_NAMES[video.interviewee] || video.interviewee;
    
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
            <div><strong>${displayName}</strong></div>
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

// Response system
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
    
    const videoClusters = organizeByTopics(videos);
    renderHorizontalGrid(videoClusters);
    renderScrollGIFs();
    buildFilterUI(videos);
    
    // Enable horizontal scroll
    window.addEventListener('scroll', handleScroll);
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