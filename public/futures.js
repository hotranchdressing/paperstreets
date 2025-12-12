// FUTURES VIDEOS - 15 clips
const VIDEOS = [
    {id:"v2",interviewee:"kwesi",duration:67,title:"Shifting towards project management",url:"https://drive.google.com/file/d/1-8hgiAlyK0BeN-C9EXbGQDEfzpUXG0Np/preview"},
    {id:"v5",interviewee:"kwesi",duration:103,title:"I would like rockdust to be as readily available as compost",url:"https://drive.google.com/file/d/1DyELBlQ8Kb24NvPYMnCrhWkHXcdaouKG/preview"},
    {id:"v6",interviewee:"kwesi",duration:16,title:"I would like there to be grantwriters to support the gardeners",url:"https://drive.google.com/file/d/18Q_7a9Oq9zm63RJvJ34o-Xro_8Ucc_f_/preview"},
    {id:"v7",interviewee:"kwesi",duration:86,title:"It's Proven that Rockdust Works, But How Much Do You Have to Add?",url:"https://drive.google.com/file/d/1NgAyeOma9dw6JgNtrhJdPlyLectgNd5O/preview"},
    {id:"v9",interviewee:"kwesi",duration:54,title:"People are becoming more aware of the impact they can have locally",url:"https://drive.google.com/file/d/1tfEV2dYw7vyOfXpRrHem7E8aHzF9S-bE/preview"},
    {id:"v10",interviewee:"kwesi",duration:75,title:"Rent is Way Too Damn High",url:"https://drive.google.com/file/d/13vH3Gyz-_LjsnEOs47a0bWw8pJGvvPk4/preview"},
    {id:"v11",interviewee:"kwesi",duration:48,title:"Teaching people to grow food, and how to cook it",url:"https://drive.google.com/file/d/1RQjBj0eBAc4Q51gzxtkXwjio_M8VSq3D/preview"},
    {id:"v14",interviewee:"ena",duration:136,title:"A garden really isn't functioning unless you're attached to a school",url:"https://drive.google.com/file/d/1T-ep3-4d3ggY2X9YjQ9YJ8I60pKmuZPU/preview"},
    {id:"v15",interviewee:"ena",duration:33,title:"Children need to know that urban ag is essential",url:"https://drive.google.com/file/d/1UfenSE4mjIGO9jhBOyvtAYmeYXv80yPz/preview"},
    {id:"v19",interviewee:"ena",duration:44,title:"I love to teach",url:"https://drive.google.com/file/d/1wbHbF_TPpotwlLfGGXu3E9l1t17neq8P/preview"},
    {id:"v20",interviewee:"ena",duration:46,title:"I think I have a couple more gardens in me",url:"https://drive.google.com/file/d/1O6UTvnjxCZzlPtPxxn-2LBOdH_7pbxRG/preview"},
    {id:"v31",interviewee:"ena",duration:37,title:"You encourage me",url:"https://drive.google.com/file/d/14ZDhOpiT0D9K9uT5VCfbuEHbeYr2199z/preview"},
    {id:"v35",interviewee:"anamaria",duration:86,title:"I don't want to be the only Witchy Womanist",url:"https://drive.google.com/file/d/1GpnQzOthqAp9Varc0zD7fgY8_1kffrKc/preview"},
    {id:"v38",interviewee:"anamaria",duration:105,title:"I'm the witch",url:"https://drive.google.com/file/d/1mEca4gFp3OvyRF0WhPcPYlsdczti1EYp/preview"},
    {id:"v39",interviewee:"qiana",duration:202,title:"Greener, safer, more resilient spaces",url:"https://drive.google.com/file/d/1i0LhC9E1PsYRp_kgMNwSWN64zMqm2hxD/preview"}
];

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

function renderVideos() {
    const container = document.getElementById('theme-content');
    
    const byInterviewee = {};
    VIDEOS.forEach(v => {
        if (!byInterviewee[v.interviewee]) {
            byInterviewee[v.interviewee] = [];
        }
        byInterviewee[v.interviewee].push(v);
    });
    
    Object.values(byInterviewee).forEach(group => {
        group.sort((a, b) => a.duration - b.duration);
    });
    
    let html = '';
    
    Object.entries(byInterviewee).forEach(([interviewee, clips]) => {
        html += `
            <div class="speaker-section">
                <h3 class="speaker-name" style="color: ${INTERVIEWEE_COLORS[interviewee]}">${FORMAL_NAMES[interviewee] || interviewee}</h3>
                
                <div class="clips-grid">
                    ${clips.map(video => renderVideoTile(video)).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    console.log('Rendered ' + VIDEOS.length + ' video tiles');
}

function renderVideoTile(video) {
    const maxDuration = 319;
    const minDuration = 13;
    const normalizedDuration = (video.duration - minDuration) / (maxDuration - minDuration);
    const size = 120 + (1 - normalizedDuration) * 100;
    
    return `
        <div class="video-tile" 
             onclick="openVideo('${video.id}')"
             style="width: ${size}px; height: ${size}px; background-color: ${INTERVIEWEE_COLORS[video.interviewee]}">
            <div class="tile-content">
                <div class="tile-title">${video.title}</div>
                <div class="tile-duration">${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}</div>
            </div>
        </div>
    `;
}

function openVideo(videoId) {
    const video = VIDEOS.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-video-content');
    const displayName = FORMAL_NAMES[video.interviewee] || video.interviewee;
    
    const relatedVideos = VIDEOS
        .filter(v => v.id !== video.id && v.interviewee === video.interviewee)
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
    `;
    
    modal.classList.add('visible');
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('visible');
    
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        iframe.src = iframe.src;
    }
}

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

renderVideos();
console.log('Futures page loaded - 15 videos');