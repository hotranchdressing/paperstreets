// Google Sheets configuration
const SHEET_ID = '1_Szf2HEZgx8l5ro5phSEoS3qvRLOJEdtSNqyHJPcg2U';
const SHEET_NAME = 'Sheet1';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

// GIFs - Add your actual GIF data here
const YOUR_GIFS = [
    { 
        id: 'gif1',
        url: 'assets/gif/callalloo.gif',
        text: 'Visual interpretation of urban growth patterns',
        themes: ['community', 'gardening']
    },
    { 
        id: 'gif2',
        url: 'assets/gif/dandelion.gif',
        text: 'Rhythms of seasonal planting cycles',
        themes: ['technique', 'future']
    },
    { 
        id: 'gif3',
        url: 'assets/gif/dancingcollard.gif',
        text: 'Rhythms of seasonal planting cycles',
        themes: ['technique', 'future']
    },
    { 
        id: 'gif4',
        url: 'assets/gif/callalloodrink.gif',
        text: 'Rhythms of seasonal planting cycles',
        themes: ['technique', 'future']
    },
    { 
        id: 'gif5',
        url: 'assets/gif/garlic.gif',
        text: 'Rhythms of seasonal planting cycles',
        themes: ['technique', 'future']
    },
    { 
        id: 'gif6',
        url: 'assets/gif/ladyliberty.gif',
        text: 'Rhythms of seasonal planting cycles',
        themes: ['technique', 'future']
    },
    { 
        id: 'gif7',
        url: 'assets/gif/pepperplant.gif',
        text: 'Rhythms of seasonal planting cycles',
        themes: ['technique', 'future']
    },
    { 
        id: 'gif8',
        url: 'assets/gif/sotomayerhomes.gif',
        text: 'Rhythms of seasonal planting cycles',
        themes: ['technique', 'future']
    }
    // Add more of your GIFs with associated themes
];

const STUDENT_GIFS = [
    {
        id: 'sgif1',
        url: 'assets/gif/AbdoulBaldeTheSnake.gif',
        text: 'Abdoul Balde - The Snake',
        themes: ['community']
    },
    {
        id: 'sgif2',
        url: 'assets/gif/AlexanderHarrisWormAnimation.gif',
        text: 'Alexander Harris - Worm Animation',
        themes: ['practice']
    },
    {
        id: 'sgif3',
        url: 'assets/gif/AloeAnimationGif.gif',
        text: 'Karamoko Tounkara - Aloe Animation',
        themes: ['future']
    },
    {
        id: 'sgif4',
        url: 'assets/gif/KwameKusiGIF.gif',
        text: 'Kwame Kusi - Corn Animation',
        themes: ['politics']
    },
    {
        id: 'sgif5',
        url: 'assets/gif/LatifGIF.gif',
        text: 'Latif Latif - Corn Animation',
        themes: ['health']
    },
    {
        id: 'sgif6',
        url: 'assets/gif/LeoGIF.gif',
        text: 'Leo Rodriguez - Corn Animation',
        themes: ['personal']
    },
    // Add student GIFs
];

// State
let allVideos = [];
let responses = {};
let currentView = 'home';
let currentTheme = null;

// Formal names
const FORMAL_NAMES = {
    'qiana': 'Qiana Mickie',
    'anamaria': 'Dr. Anamaría Flores',
    'ena': 'Ms. Ena K. McPherson',
    'kwesi': 'Kwesi Joseph, MBA'
};

const INTERVIEWEE_COLORS = {
    'qiana': '#a8b8c5',
    'anamaria': '#c9b5b8',
    'ena': '#b8c5b0',
    'kwesi': '#d4c5a9'
};

// Main themes with descriptions
const THEMES = {
    'community': {
        name: 'Community',
        description: 'Gardens as gathering spaces, shared labor, and neighborhood connection',
        color: '#b8c5b0'
    },
    'gardening': {
        name: 'Practice',
        description: 'Techniques, methods, soil, compost, and hands-on knowledge',
        color: '#d4c5a9'
    },
    'future': {
        name: 'Futures',
        description: 'Visions for food systems, climate resilience, and next generations',
        color: '#a8b8c5'
    },
    'politics': {
        name: 'Politics',
        description: 'Power, policy, access, and resistance in urban agriculture',
        color: '#c9b5b8'
    },
    'health': {
        name: 'Health & Wellness',
        description: 'Food access, bodily connection to growing, and community wellbeing',
        color: '#b8d4b0'
    },
    'personal': {
        name: 'Personal Stories',
        description: 'Individual journeys, motivations, and lived experiences',
        color: '#d4c5b8'
    }
};

// Convert Google Drive URL
function convertDriveUrl(shareUrl) {
    const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return shareUrl;
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
            return {
                id: cells[0]?.v || '',
                interviewee: cells[1]?.v || '',
                topics: cells[2]?.v ? cells[2].v.split(',').map(t => t.trim()) : [],
                duration: parseInt(cells[3]?.v) || 0,
                title: cells[4]?.v || '',
                url: convertDriveUrl(cells[5]?.v || '')
            };
        }).filter(v => v.id);
        
        return videos;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return [];
    }
}

// Get videos for a specific theme
function getVideosForTheme(theme) {
    return allVideos.filter(v => v.topics.includes(theme));
}

// Count videos per theme
function getThemeCounts() {
    const counts = {};
    Object.keys(THEMES).forEach(theme => {
        counts[theme] = allVideos.filter(v => v.topics.includes(theme)).length;
    });
    return counts;
}

// Render homepage with theme cards
function renderHomepage() {
    currentView = 'home';
    const app = document.getElementById('app');
    const counts = getThemeCounts();
    
    // Get one random GIF for homepage
    const featuredGif = YOUR_GIFS[Math.floor(Math.random() * YOUR_GIFS.length)];
    
    app.innerHTML = `
        <div class="homepage">
            ${featuredGif ? `
                <div class="featured-gif" onclick="toggleGifText(this)">
                    <img src="${featuredGif.url}" alt="Featured visual">
                    <div class="gif-text hidden">${featuredGif.text}</div>
                </div>
            ` : ''}
            
            <div class="theme-grid">
                ${Object.entries(THEMES).map(([key, theme]) => `
                    <div class="theme-card" onclick="navigateToTheme('${key}')" style="border-color: ${theme.color}">
                        <h2>${theme.name}</h2>
                        <p class="theme-description">${theme.description}</p>
                        <p class="theme-count">${counts[key] || 0} clips</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Render theme page
function renderThemePage(themeKey) {
    currentView = 'theme';
    currentTheme = themeKey;
    
    const theme = THEMES[themeKey];
    const videos = getVideosForTheme(themeKey);
    const themeGifs = [...YOUR_GIFS, ...STUDENT_GIFS].filter(gif => 
        gif.themes && gif.themes.includes(themeKey)
    );
    
    // Group by interviewee
    const byInterviewee = {};
    videos.forEach(v => {
        if (!byInterviewee[v.interviewee]) {
            byInterviewee[v.interviewee] = [];
        }
        byInterviewee[v.interviewee].push(v);
    });
    
    // Sort each group by duration (shortest first)
    Object.values(byInterviewee).forEach(group => {
        group.sort((a, b) => a.duration - b.duration);
    });
    
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="theme-page">
            <nav class="breadcrumb">
                <span onclick="navigateToHome()" class="breadcrumb-link">Home</span>
                <span class="breadcrumb-separator">→</span>
                <span>${theme.name}</span>
            </nav>
            
            <header class="theme-header">
                <h1>${theme.name}</h1>
                <p>${theme.description}</p>
                <p class="clip-count">${videos.length} clips</p>
            </header>
            
            <div class="theme-content">
                ${Object.entries(byInterviewee).map(([interviewee, clips], idx) => `
                    <div class="speaker-section">
                        <h3 class="speaker-name" style="color: ${INTERVIEWEE_COLORS[interviewee]}">${FORMAL_NAMES[interviewee] || interviewee}</h3>
                        
                        <div class="clips-grid">
                            ${clips.map(video => renderVideoTile(video)).join('')}
                        </div>
                    </div>
                    
                    ${themeGifs[idx] ? `
                        <div class="theme-gif" onclick="toggleGifText(this)">
                            <img src="${themeGifs[idx].url}" alt="Visual interpretation">
                            <div class="gif-text hidden">${themeGifs[idx].text}</div>
                        </div>
                    ` : ''}
                `).join('')}
            </div>
        </div>
    `;
}

// Render video tile
function renderVideoTile(video) {
    const maxDuration = 319;
    const minDuration = 13;
    const normalizedDuration = (video.duration - minDuration) / (maxDuration - minDuration);
    const size = 120 + (1 - normalizedDuration) * 100; // 120-220px
    
    return `
        <div class="video-tile" 
             onclick="openVideo('${video.id}')"
             style="width: ${size}px; height: ${size}px; background-color: ${INTERVIEWEE_COLORS[video.interviewee]}">
            <div class="tile-overlay">
                <div class="tile-title">${video.title}</div>
                <div class="tile-duration">${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}</div>
            </div>
        </div>
    `;
}

// Navigation functions
function navigateToHome() {
    renderHomepage();
    window.scrollTo(0, 0);
}

function navigateToTheme(themeKey) {
    renderThemePage(themeKey);
    window.scrollTo(0, 0);
}

// Toggle GIF text
function toggleGifText(element) {
    const img = element.querySelector('img');
    const text = element.querySelector('.gif-text');
    
    if (text.classList.contains('hidden')) {
        img.classList.add('hidden');
        text.classList.remove('hidden');
    } else {
        text.classList.add('hidden');
        img.classList.remove('hidden');
    }
}

// Open video modal
function openVideo(videoId) {
    const video = allVideos.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-video-content');
    
    const displayName = FORMAL_NAMES[video.interviewee] || video.interviewee;
    
    // Get related videos (share at least one topic, exclude current)
    const relatedVideos = allVideos
        .filter(v => v.id !== video.id && v.topics.some(t => video.topics.includes(t)))
        .slice(0, 3);
    
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
        
        ${relatedVideos.length > 0 ? `
            <div class="related-clips">
                <h4>Related clips</h4>
                <div class="related-grid">
                    ${relatedVideos.map(v => `
                        <div class="related-clip" onclick="openVideo('${v.id}')">
                            <div class="related-title">${v.title}</div>
                            <div class="related-speaker">${FORMAL_NAMES[v.interviewee]}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div class="response-section">
            <h4>Conversation</h4>
            <div class="response-list" id="${video.id}-responses"></div>
            
            <div class="response-input">
                <textarea 
                    id="${video.id}-response-text" 
                    placeholder="Add to the conversation..."
                ></textarea>
                <button class="btn-primary" id="${video.id}-submit-response">Continue Chain</button>
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
    allVideos = await fetchVideosFromSheet();
    console.log(`Loaded ${allVideos.length} videos`);
    
    renderHomepage();
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