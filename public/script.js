// HARDCODED VIDEO DATA - NO MORE SLOW LOADING!
const ALL_VIDEOS = [
    {id:"v1",interviewee:"kwesi",topics:["biochar","microplastics","microbes","carbon"],duration:30,title:"Biochar isn't just a great medium for microbes",url:"https://drive.google.com/file/d/12w-b0tz9ZNyScOGdPfV6Z_aYmE_-JYNM/preview"},
    {id:"v2",interviewee:"kwesi",topics:["soil","biochar","compost","future"],duration:67,title:"Shifting towards project management",url:"https://drive.google.com/file/d/1-8hgiAlyK0BeN-C9EXbGQDEfzpUXG0Np/preview"},
    {id:"v3",interviewee:"kwesi",topics:["health","gardening","tomato"],duration:13,title:"Gardening is critical to our health",url:"https://drive.google.com/file/d/1BJVzeo5RSMU2k49RUNRjW4us28oKkqrE/preview"},
    {id:"v4",interviewee:"kwesi",topics:["health","gardening","personal"],duration:55,title:"I Started Gardening Because I Was Stressed",url:"https://drive.google.com/file/d/1Y1ZxawbB6i4-xengELFVK6Tke3ZB3Mmf/preview"},
    {id:"v5",interviewee:"kwesi",topics:["rockdust","soil","future"],duration:103,title:"I would like rockdust to be as readily available as compost",url:"https://drive.google.com/file/d/1DyELBlQ8Kb24NvPYMnCrhWkHXcdaouKG/preview"},
    {id:"v6",interviewee:"kwesi",topics:["future","grants","gardening"],duration:16,title:"I would like there to be grantwriters to support the gardeners",url:"https://drive.google.com/file/d/18Q_7a9Oq9zm63RJvJ34o-Xro_8Ucc_f_/preview"},
    {id:"v7",interviewee:"kwesi",topics:["rockdust","soil","future"],duration:86,title:"It's Proven that Rockdust Works, But How Much Do You Have to Add?",url:"https://drive.google.com/file/d/1NgAyeOma9dw6JgNtrhJdPlyLectgNd5O/preview"},
    {id:"v8",interviewee:"kwesi",topics:["intro","personal"],duration:21,title:"My name is Kwesi Joseph",url:"https://drive.google.com/file/d/1BMIpihlxFaNaaxSWXHIpPPsSm-DVWaDV/preview"},
    {id:"v9",interviewee:"kwesi",topics:["future","carbon","gardening","climate"],duration:54,title:"People are becoming more aware of the impact they can have locally",url:"https://drive.google.com/file/d/1tfEV2dYw7vyOfXpRrHem7E8aHzF9S-bE/preview"},
    {id:"v10",interviewee:"kwesi",topics:["future","gardening","rent","elders"],duration:75,title:"Rent is Way Too Damn High",url:"https://drive.google.com/file/d/13vH3Gyz-_LjsnEOs47a0bWw8pJGvvPk4/preview"},
    {id:"v11",interviewee:"kwesi",topics:["future","gardening","food"],duration:48,title:"Teaching people to grow food, and how to cook it",url:"https://drive.google.com/file/d/1RQjBj0eBAc4Q51gzxtkXwjio_M8VSq3D/preview"},
    {id:"v12",interviewee:"kwesi",topics:["rockdust","gardening","compost","soil","water"],duration:75,title:"There's Conventional, There's Organic, and There's Natural",url:"https://drive.google.com/file/d/1Yc_oGreWdkt1iABKfKFXcA4VyfwRs0J9/preview"},
    {id:"v13",interviewee:"kwesi",topics:["food","technique","gardening"],duration:51,title:"Tomatoes Require A TON of Space",url:"https://drive.google.com/file/d/1j3pwkorC2nu2-z9b1XlMzKJxT1u6wmCE/preview"},
    {id:"v14",interviewee:"ena",topics:["future","gardening","youth"],duration:136,title:"A garden really isn't functioning unless you're attached to a school",url:"https://drive.google.com/file/d/1T-ep3-4d3ggY2X9YjQ9YJ8I60pKmuZPU/preview"},
    {id:"v15",interviewee:"ena",topics:["future","youth","health"],duration:33,title:"Children need to know that urban ag is essential",url:"https://drive.google.com/file/d/1UfenSE4mjIGO9jhBOyvtAYmeYXv80yPz/preview"},
    {id:"v16",interviewee:"ena",topics:["technique","gardening","soil"],duration:74,title:"For two years, we kept mulching the land",url:"https://drive.google.com/file/d/1nhnB3XfQTmmXr1hBePSdFqNX9ZB-AguD/preview"},
    {id:"v17",interviewee:"ena",topics:["gardening","pollinators","climate","health"],duration:67,title:"Gardens are the lungs of the city",url:"https://drive.google.com/file/d/1TrTJMqqoLf3QS3fgnNgoX06rDtqYcVsb/preview"},
    {id:"v18",interviewee:"ena",topics:["personal"],duration:64,title:"I decided I wanted to live in a more Afrocentric neighborhood",url:"https://drive.google.com/file/d/1PqjDDDQZsmgXvo7epuQqs-iZsOntieQ6/preview"},
    {id:"v19",interviewee:"ena",topics:["youth","future","education"],duration:44,title:"I love to teach",url:"https://drive.google.com/file/d/1wbHbF_TPpotwlLfGGXu3E9l1t17neq8P/preview"},
    {id:"v20",interviewee:"ena",topics:["future","gardening","personal"],duration:46,title:"I think I have a couple more gardens in me",url:"https://drive.google.com/file/d/1O6UTvnjxCZzlPtPxxn-2LBOdH_7pbxRG/preview"},
    {id:"v21",interviewee:"ena",topics:["personal"],duration:81,title:"I was depressed for one day",url:"https://drive.google.com/file/d/1SchMzHbL9fPpebXNi0nLJ6GXXjsYrwae/preview"},
    {id:"v22",interviewee:"ena",topics:["personal"],duration:57,title:"I was young and gorgeous",url:"https://drive.google.com/file/d/1z0Rqp1fuxyL7HJY4c25k5Jde1TAO4cZD/preview"},
    {id:"v23",interviewee:"ena",topics:["food","politics"],duration:42,title:"It's not a privilege to have access to good food",url:"https://drive.google.com/file/d/1idSGVzVLNgf3nLE3gWxMPPQZ2V_HWswx/preview"},
    {id:"v24",interviewee:"ena",topics:["politics","gardening","community"],duration:319,title:"More than 50 percent of gardening is politics",url:"https://drive.google.com/file/d/1RxSqcG7TPTD393iy6hepYhOyO4hbRIuU/preview"},
    {id:"v25",interviewee:"ena",topics:["politics","gardening","community","elders"],duration:48,title:"Most of the gardens are founded by Black and Brown women",url:"https://drive.google.com/file/d/1YII9Vr3sYiQmxU6otBkDuYsbGryB33uJ/preview"},
    {id:"v26",interviewee:"ena",topics:["intro","personal"],duration:53,title:"My name is Ena K. McPherson",url:"https://drive.google.com/file/d/1IlMVV47bEawPHTeGp4nTTUPCSmQkDJ_1/preview"},
    {id:"v27",interviewee:"ena",topics:["climate","politics","community","gardening"],duration:29,title:"The resistance to climate change started in our gardens",url:"https://drive.google.com/file/d/1Ru1szv4gwxSbs3hVayUqjKZGrdx3TYVz/preview"},
    {id:"v28",interviewee:"ena",topics:["technique","politics","community"],duration:241,title:"We could build a whole movement around that",url:"https://drive.google.com/file/d/1pbwF49AolakJhFJ0edFlffoquEdrQmjg/preview"},
    {id:"v29",interviewee:"ena",topics:["community","gardening","food"],duration:52,title:"We have breakfast at the end of the season",url:"https://drive.google.com/file/d/1T7n8ceSLMFTh2PmWRk9vxApFRAJVHphD/preview"},
    {id:"v30",interviewee:"ena",topics:["food","community","compost"],duration:239,title:"You can tell how a person is feeding themselves by what they compost",url:"https://drive.google.com/file/d/1miMcLpkcBaUGjxksAMNK4F-WCse56O0P/preview"},
    {id:"v31",interviewee:"ena",topics:["food","youth","education","gardening","future"],duration:37,title:"You encourage me",url:"https://drive.google.com/file/d/14ZDhOpiT0D9K9uT5VCfbuEHbeYr2199z/preview"},
    {id:"v32",interviewee:"anamaria",topics:["Bronx","community"],duration:34,title:"I live and work in the South Bronx",url:"https://drive.google.com/file/d/18jzcfcajJaLja4LiIAqSfmyS9AMSKkYF/preview"},
    {id:"v33",interviewee:"anamaria",topics:["community","education","gardening","technique"],duration:173,title:"Centering the African Diaspora",url:"https://drive.google.com/file/d/1dzTVS8NAuARUp39HBUXyDFxJku-pvG-z/preview"},
    {id:"v34",interviewee:"anamaria",topics:["intro","personal"],duration:26,title:"My name is Dr. Anamaría Flores",url:"https://drive.google.com/file/d/1nG-03txGflm2zwjiDvN14bnzkRS3zp0n/preview"},
    {id:"v35",interviewee:"anamaria",topics:["education","future","technique"],duration:86,title:"I don't want to be the only Witchy Womanist",url:"https://drive.google.com/file/d/1GpnQzOthqAp9Varc0zD7fgY8_1kffrKc/preview"},
    {id:"v36",interviewee:"anamaria",topics:["community","gardening"],duration:101,title:"I don't know how long New Roots has been in this neighborhood",url:"https://drive.google.com/file/d/13qaE4QwOpFTPfWAVJ81xKxFrVbQQzfnW/preview"},
    {id:"v37",interviewee:"anamaria",topics:["education","youth","technique"],duration:108,title:"I always bring in an energy clearing spray",url:"https://drive.google.com/file/d/13qaE4QwOpFTPfWAVJ81xKxFrVbQQzfnW/preview"},
    {id:"v38",interviewee:"anamaria",topics:["future","education"],duration:105,title:"I'm the witch",url:"https://drive.google.com/file/d/1mEca4gFp3OvyRF0WhPcPYlsdczti1EYp/preview"},
    {id:"v39",interviewee:"qiana",topics:["future","climate","gardening","education","food"],duration:202,title:"Greener, safer, more resilient spaces",url:"https://drive.google.com/file/d/1i0LhC9E1PsYRp_kgMNwSWN64zMqm2hxD/preview"},
    {id:"v40",interviewee:"qiana",topics:["community","education","food"],duration:134,title:"Connecting volunteers to gleaning opportunities",url:"https://drive.google.com/file/d/15HOgxU8Ec3HB_cOdVMud4RnwJNeyP5rC/preview"},
    {id:"v41",interviewee:"qiana",topics:["intro","personal"],duration:32,title:"My name is Qiana Mickie",url:"https://drive.google.com/file/d/1C1_faJQDbAWsASXIj3j-ULQf_tsednD4/preview"},
    {id:"v42",interviewee:"qiana",topics:["politics","community","grants"],duration:154,title:"We're here to protect and amplify their power even more",url:"https://drive.google.com/file/d/1wOOrnAgwydrYpJAk2IrNrClASn1ibPk5/preview"},
    {id:"v43",interviewee:"qiana",topics:["food","community","politics","personal"],duration:190,title:"Everybody deserves quality goods and services",url:"https://drive.google.com/file/d/1JaUQYqLkxKe55-LYFz59YHfly4R75Q7P/preview"},
    {id:"v44",interviewee:"qiana",topics:["youth","elders","community"],duration:227,title:"How to build a succession plan",url:"https://drive.google.com/file/d/1JlNg02EYNXqeE5shG9W0jwS0fCPAUcwo/preview"},
    {id:"v45",interviewee:"qiana",topics:["politics"],duration:295,title:"How do we find a common thread",url:"https://drive.google.com/file/d/1JvtyxN1Ou8ChIoCuKiV_1fYrL-aEPxEu/preview"}
];

// GIFs
const YOUR_GIFS = [
    { 
        id: 'gif1',
        url: 'https://drive.google.com/uc?export=view&id=1msLPOMbSM0BylRKduw86YBK_1oSjQeIE',
        text: '',
        themes: ['community']
    },
    { 
        id: 'gif2',
        url: 'https://drive.google.com/uc?export=view&id=10jn7PaWNoi8mwkoQP7oz5fGs4PEzw_0j',
        text: '',
        themes: ['gardening']
    },
    { 
        id: 'gif3',
        url: 'https://drive.google.com/uc?export=view&id=1P_rWimK3uq20-T1XcaWjsExNb_JoT9Rl',
        text: '',
        themes: ['future']
    },
    { 
        id: 'gif4',
        url: 'https://drive.google.com/uc?export=view&id=1_vdP21Ieypv3yVZx0A2AVeRXo_ywTvP9',
        text: '',
        themes: ['politics']
    },
    { 
        id: 'gif5',
        url: 'https://drive.google.com/uc?export=view&id=1AVQqYYk0ip05wQFise7uOGIt4DCF06Vx',
        text: '',
        themes: ['health']
    },
    { 
        id: 'gif6',
        url: 'https://drive.google.com/uc?export=view&id=1_rCJs2O3kYUC990JEluhqK2gk2eWGmqs',
        text: '',
        themes: ['personal']
    },
    { 
        id: 'gif7',
        url: 'https://drive.google.com/uc?export=view&id=1I5W_Iud5TCO-m4gIukx4VxRGGSFV_Wfa',
        text: '',
        themes: ['community']
    },
    { 
        id: 'gif8',
        url: 'https://drive.google.com/uc?export=view&id=1dAwet46krAL3FkFZi0YqZlqpN9-MTF03',
        text: '',
        themes: ['gardening']
    }
];

const STUDENT_GIFS = [
    {
        id: 'sgif1',
        url: 'https://drive.google.com/uc?export=view&id=1GkIWGAmN0pBmczPU5bpQWNNHMNAbxqO1',
        text: 'Abdoul Balde - The Snake',
        themes: ['community']
    },
    {
        id: 'sgif2',
        url: 'https://drive.google.com/uc?export=view&id=13vBsbGfCbbQoUwrxAk86tZqia5uOv2WJ',
        text: 'Alexander Harris - Worm Animation',
        themes: ['gardening']
    },
    {
        id: 'sgif3',
        url: 'https://drive.google.com/uc?export=view&id=1mxxYVA66Lo9XQv8cF8ovPtCsQW1z1Exm',
        text: 'Karamoko Tounkara - Aloe Animation',
        themes: ['future']
    },
    {
        id: 'sgif4',
        url: 'https://drive.google.com/uc?export=view&id=1VrBaqXacuPLAC28VRzJndSZXbqGBZixi',
        text: 'Kwame Kusi - Corn Animation',
        themes: ['politics']
    },
    {
        id: 'sgif5',
        url: 'https://drive.google.com/uc?export=view&id=156pXzdp6watMGsL9pmk8CnxHXRfuz52R',
        text: 'Latif Latif - Corn Animation',
        themes: ['health']
    },
    {
        id: 'sgif6',
        url: 'https://drive.google.com/uc?export=view&id=10qsa288r6oMuC2fZbDbLVUEGaX38jbzw',
        text: 'Leo Rodriguez - Corn Animation',
        themes: ['personal']
    }
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

// Main themes
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

// Initialize - INSTANT LOADING!
async function init() {
    await loadResponses();
    allVideos = ALL_VIDEOS; // No fetching - just assign!
    console.log(`Loaded ${allVideos.length} videos INSTANTLY!`);
    
    renderHomepage();
}

// Try both DOMContentLoaded and immediate execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded, run immediately
    init();
}

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