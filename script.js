// Prompts for each category
const prompts = {
    growing: [
        "What dream are you planting for your community?",
        "What hope do you want to see grow in Soundview?",
        "What skill or knowledge do you want to cultivate?",
        "What positive change do you envision for the neighborhood?",
        "What connections do you want to nurture?",
        "What tradition or practice do you want to keep alive?",
        "What new possibility excites you?",
        "What strength in yourself or community do you want to develop?",
        "What abundance do you imagine for the future?",
        "What seeds of change are you ready to plant?"
    ],
    composting: [
        "What fear or doubt are you ready to release?",
        "What habit no longer serves you?",
        "What limiting belief can you let go of?",
        "What past disappointment are you ready to compost?",
        "What negative pattern are you breaking?",
        "What old story about yourself can you transform?",
        "What grudge or resentment are you releasing?",
        "What barrier are you ready to break down?",
        "What self-judgment can you compost into wisdom?",
        "What are you making peace with and letting go?"
    ]
};

// Plant SVG data - you can replace these with your actual plant image URLs
const plantImages = {
    growing: [
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 40 Q60 50 55 60 Q50 70 50 90' fill='%2334a853'/%3E%3Ccircle cx='50' cy='90' r='3' fill='%238B4513'/%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 40 Q60 50 55 60 Q50 70 50 90' fill='%2334a853'/%3E%3Cellipse cx='45' cy='50' rx='8' ry='12' fill='%2334a853'/%3E%3Cellipse cx='55' cy='50' rx='8' ry='12' fill='%2334a853'/%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 40 Q60 50 55 60 Q50 70 50 90' fill='%2334a853'/%3E%3Cellipse cx='45' cy='50' rx='10' ry='15' fill='%2334a853'/%3E%3Cellipse cx='55' cy='50' rx='10' ry='15' fill='%2334a853'/%3E%3Cellipse cx='50' cy='45' rx='12' ry='15' fill='%2334a853'/%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 35 Q60 50 55 60 Q50 70 50 90' fill='%2334a853'/%3E%3Cellipse cx='45' cy='50' rx='12' ry='18' fill='%2334a853'/%3E%3Cellipse cx='55' cy='50' rx='12' ry='18' fill='%2334a853'/%3E%3Cellipse cx='50' cy='40' rx='15' ry='20' fill='%2334a853'/%3E%3Ccircle cx='50' cy='35' r='8' fill='%23fbbc04'/%3E%3C/svg%3E"
    ],
    composting: [
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 40 Q60 50 55 60 Q50 70 50 90' fill='%23a0826d'/%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 40 Q60 50 55 60 Q50 70 50 90' fill='%23a0826d'/%3E%3Cellipse cx='45' cy='50' rx='7' ry='10' fill='%238d7257'/%3E%3Cellipse cx='55' cy='50' rx='7' ry='10' fill='%238d7257'/%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 40 Q60 50 55 60 Q50 70 50 90' fill='%23a0826d'/%3E%3Cellipse cx='45' cy='50' rx='9' ry='13' fill='%238d7257'/%3E%3Cellipse cx='55' cy='50' rx='9' ry='13' fill='%238d7257'/%3E%3Cellipse cx='50' cy='45' rx='10' ry='13' fill='%238d7257'/%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 90 Q50 70 45 60 Q40 50 50 35 Q60 50 55 60 Q50 70 50 90' fill='%23a0826d'/%3E%3Cellipse cx='45' cy='50' rx='11' ry='16' fill='%238d7257'/%3E%3Cellipse cx='55' cy='50' rx='11' ry='16' fill='%238d7257'/%3E%3Cellipse cx='50' cy='40' rx='13' ry='18' fill='%238d7257'/%3E%3Ccircle cx='50' cy='35' r='6' fill='%23d4af37'/%3E%3C/svg%3E"
    ]
};

let currentPrompt = null;
let currentCategory = null;

// Initialize the app
async function init() {
    generateNewPrompt();
    loadAllResponses();
    updateStats();
    
    // Set up event listeners
    document.getElementById('submit-btn').addEventListener('click', submitResponse);
    document.getElementById('new-prompt-btn').addEventListener('click', generateNewPrompt);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitResponse();
    });
    
    // Poll for updates every 5 seconds
    setInterval(() => {
        loadAllResponses();
        updateStats();
    }, 5000);
}

// Generate a random prompt
function generateNewPrompt() {
    const categories = ['growing', 'composting'];
    currentCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryPrompts = prompts[currentCategory];
    currentPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
    
    document.getElementById('current-prompt').textContent = currentPrompt;
    document.getElementById('prompt-category').textContent = currentCategory === 'growing' ? '🌱 Growing' : '🗑️ Composting';
    document.getElementById('prompt-category').style.color = currentCategory === 'growing' ? '#34a853' : '#8B4513';
}

// Submit a response
async function submitResponse() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    
    if (!text) {
        alert('Please enter your thoughts before planting!');
        return;
    }
    
    const response = {
        text: text,
        category: currentCategory,
        prompt: currentPrompt,
        timestamp: Date.now()
    };
    
    try {
        // Generate unique key for this response
        const key = `response:${response.timestamp}:${Math.random().toString(36).substr(2, 9)}`;
        await window.storage.set(key, JSON.stringify(response), true);
        
        // Clear input and show success
        input.value = '';
        input.placeholder = 'Thank you for sharing! Add another...';
        setTimeout(() => {
            input.placeholder = 'Share your thoughts...';
        }, 3000);
        
        // Immediately add to UI
        addFloatingText(response);
        
        // Refresh stats and leaderboard
        await updateStats();
        await loadRecentSubmissions();
        
        // Generate new prompt
        generateNewPrompt();
        
    } catch (error) {
        console.error('Error submitting response:', error);
        alert('There was an error saving your response. Please try again.');
    }
}

// Load all responses from storage
async function loadAllResponses() {
    try {
        const result = await window.storage.list('response:', true);
        
        if (!result || !result.keys) {
            return;
        }
        
        // Clear existing floating texts
        document.getElementById('growing-responses').innerHTML = '';
        document.getElementById('composting-responses').innerHTML = '';
        
        // Load each response
        for (const key of result.keys) {
            try {
                const data = await window.storage.get(key, true);
                if (data && data.value) {
                    const response = JSON.parse(data.value);
                    addFloatingText(response);
                }
            } catch (err) {
                console.error('Error loading response:', err);
            }
        }
        
        await loadRecentSubmissions();
        
    } catch (error) {
        console.error('Error loading responses:', error);
    }
}

// Add floating text to the appropriate zone
function addFloatingText(response) {
    const containerId = response.category === 'growing' ? 'growing-responses' : 'composting-responses';
    const container = document.getElementById(containerId);
    
    const textElement = document.createElement('div');
    textElement.className = 'floating-text';
    textElement.textContent = response.text;
    
    // Random position
    const maxX = container.offsetWidth - 220;
    const maxY = container.offsetHeight - 80;
    const x = Math.random() * Math.max(0, maxX);
    const y = Math.random() * Math.max(0, maxY);
    
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    textElement.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(textElement);
}

// Update statistics
async function updateStats() {
    try {
        const result = await window.storage.list('response:', true);
        
        if (!result || !result.keys) {
            return;
        }
        
        let growingCount = 0;
        let compostingCount = 0;
        
        for (const key of result.keys) {
            try {
                const data = await window.storage.get(key, true);
                if (data && data.value) {
                    const response = JSON.parse(data.value);
                    if (response.category === 'growing') {
                        growingCount++;
                    } else {
                        compostingCount++;
                    }
                }
            } catch (err) {
                console.error('Error reading response:', err);
            }
        }
        
        const totalCount = growingCount + compostingCount;
        
        document.getElementById('growing-count').textContent = growingCount;
        document.getElementById('composting-count').textContent = compostingCount;
        document.getElementById('total-count').textContent = totalCount;
        
        // Update plant growth
        updatePlantGrowth('growing', growingCount);
        updatePlantGrowth('composting', compostingCount);
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Update plant growth visualization
function updatePlantGrowth(category, count) {
    const containerId = category === 'growing' ? 'growing-plants' : 'composting-plants';
    const container = document.getElementById(containerId);
    
    // Calculate growth stage (0-3) based on count
    const plantsPerStage = 5;
    const stage = Math.min(3, Math.floor(count / plantsPerStage));
    
    // Calculate number of plants to show
    const numPlants = Math.min(Math.floor(count / 2), 8);
    
    // Clear existing plants
    container.innerHTML = '';
    
    // Add plants
    for (let i = 0; i < numPlants; i++) {
        const plant = document.createElement('div');
        plant.className = 'plant';
        
        // Use the appropriate growth stage image
        const imageIndex = Math.min(stage, plantImages[category].length - 1);
        plant.style.backgroundImage = `url('${plantImages[category][imageIndex]}')`;
        
        // Random position
        const x = (i / numPlants) * 80 + Math.random() * 10;
        const y = 50 + Math.random() * 30;
        plant.style.left = `${x}%`;
        plant.style.top = `${y}%`;
        plant.style.animationDelay = `${i * 0.2}s`;
        
        container.appendChild(plant);
    }
}

// Load recent submissions for leaderboard
async function loadRecentSubmissions() {
    try {
        const result = await window.storage.list('response:', true);
        
        if (!result || !result.keys) {
            return;
        }
        
        const responses = [];
        
        for (const key of result.keys) {
            try {
                const data = await window.storage.get(key, true);
                if (data && data.value) {
                    responses.push(JSON.parse(data.value));
                }
            } catch (err) {
                console.error('Error loading submission:', err);
            }
        }
        
        // Sort by timestamp (newest first)
        responses.sort((a, b) => b.timestamp - a.timestamp);
        
        // Take top 20
        const recentResponses = responses.slice(0, 20);
        
        const listContainer = document.getElementById('recent-list');
        listContainer.innerHTML = '';
        
        recentResponses.forEach(response => {
            const item = document.createElement('div');
            item.className = `recent-item ${response.category}`;
            
            const textDiv = document.createElement('div');
            textDiv.className = 'recent-item-text';
            textDiv.textContent = response.text;
            
            const metaDiv = document.createElement('div');
            metaDiv.className = 'recent-item-meta';
            const categoryIcon = response.category === 'growing' ? '🌱' : '🗑️';
            const timeAgo = getTimeAgo(response.timestamp);
            metaDiv.textContent = `${categoryIcon} ${response.category} • ${timeAgo}`;
            
            item.appendChild(textDiv);
            item.appendChild(metaDiv);
            listContainer.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error loading recent submissions:', error);
    }
}

// Helper function to format time ago
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Start the app when page loads
window.addEventListener('DOMContentLoaded', init);