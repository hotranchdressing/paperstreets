// Prompt data
const prompts = [
  { question: "What are you growing?", category: "growing" },
  { question: "What are you composting?", category: "composting" }
];

let currentPromptIndex = 0;

// Element references
const currentPromptEl = document.getElementById("current-prompt");
const promptCategoryEl = document.getElementById("prompt-category");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const newPromptBtn = document.getElementById("new-prompt-btn");

const growingResponses = document.getElementById("growing-responses");
const compostingResponses = document.getElementById("composting-responses");

const growingPlants = document.getElementById("growing-plants");
const compostingPlants = document.getElementById("composting-plants");

const growingCount = document.getElementById("growing-count");
const compostingCount = document.getElementById("composting-count");
const totalCount = document.getElementById("total-count");

const recentList = document.getElementById("recent-list");

// initialize
setPrompt(currentPromptIndex);

function setPrompt(index) {
  const { question, category } = prompts[index];
  currentPromptEl.textContent = question;
  promptCategoryEl.textContent = category.toUpperCase();
}

newPromptBtn.addEventListener("click", () => {
  currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
  setPrompt(currentPromptIndex);
});

submitBtn.addEventListener("click", handleSubmit);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const text = userInput.value.trim();
  if (!text) return;

  const category = prompts[currentPromptIndex].category;

  // Create floating response
  createFloatingResponse(text, category);

  // Create plant or compost icon
  createVisualElement(category);

  // Update counts
  updateStats(category);

  // Log recent submission
  addRecentSubmission(text, category);

  // Clear input
  userInput.value = "";
}

// Create floating text bubbles
function createFloatingResponse(text, category) {
  const zone =
    category === "growing" ? growingResponses : compostingResponses;
  const bubble = document.createElement("div");
  bubble.classList.add("floating-text");
  if (category === "composting") bubble.classList.add("composting");
  bubble.textContent = text;

  const areaWidth = zone.offsetWidth;
  const areaHeight = zone.offsetHeight;
  const x = Math.random() * (areaWidth - 150);
  const y = Math.random() * (areaHeight - 50);
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;

  zone.appendChild(bubble);

  setTimeout(() => bubble.remove(), 15000);
}

// Create visual “growth” in soil or compost bin
function createVisualElement(category) {
  const zone = category === "growing" ? growingPlants : compostingPlants;
  const el = document.createElement("div");
  el.classList.add("plant");

  // ✅ Use your PNGs instead of emojis
  if (category === "growing") {
    const plantImages = [
      "images/beebalm3.png",
      "images/dogwood3.png",
      "images/lilac3.png",
      "images/milkweed3.png"
    ];
    el.style.backgroundImage = `url('${
      plantImages[Math.floor(Math.random() * plantImages.length)]
    }')`;
  } else {
    const compostImages = [
      "images/beebalm3.png",
      "images/dogwood3.png",
      "images/lilac3.png",
      "images/milkweed3.png"
    ];
    el.style.backgroundImage = `url('${
      compostImages[Math.floor(Math.random() * compostImages.length)]
    }')`;
  }

  // Random position
  const width = zone.offsetWidth;
  const height = zone.offsetHeight;
  const x = Math.random() * (width - 60);
  const y = Math.random() * (height - 80);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  zone.appendChild(el);
}

  // fade out gently
  setTimeout(() => {
    el.style.transition = "opacity 2s";
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 2000);
  }, 8000);


// Stats and logs
let growCount = 0;
let compostCount = 0;

function updateStats(category) {
  if (category === "growing") growCount++;
  else compostCount++;

  growingCount.textContent = growCount;
  compostingCount.textContent = compostCount;
  totalCount.textContent = growCount + compostCount;
}

function addRecentSubmission(text, category) {
  const item = document.createElement("div");
  item.classList.add("recent-item");
  if (category === "composting") item.classList.add("composting");

  item.innerHTML = `
    <div class="recent-item-text">${text}</div>
    <div class="recent-item-meta">${category}</div>
  `;

  recentList.prepend(item);

  // keep the list to 10 entries
  const items = recentList.querySelectorAll(".recent-item");
  if (items.length > 10) items[items.length - 1].remove();
}