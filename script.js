// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const errorMsg = document.getElementById("error");
const loadingText = document.getElementById("loading");

// Color Palette Database (Local fallback + sample data)
const paletteDatabase = {
  sunset: [
    { name: "Sunset Blaze", colors: ["#FF6B6B", "#FFA500", "#FFD700", "#FF8C00", "#DC143C"] },
    { name: "Warm Evening", colors: ["#FF4500", "#FF6347", "#FFB347", "#FFD700", "#FF8C00"] }
  ],
  ocean: [
    { name: "Deep Sea", colors: ["#001F3F", "#003D7A", "#0074D9", "#0099FF", "#7FDBFF"] },
    { name: "Tropical Water", colors: ["#1E90FF", "#00BFFF", "#00CED1", "#40E0D0", "#7FFFD4"] }
  ],
  forest: [
    { name: "Pine Forest", colors: ["#1B4D2E", "#2E8B57", "#3CB371", "#90EE90", "#00FA9A"] },
    { name: "Dark Jungle", colors: ["#0B4F2E", "#1B6E3E", "#2D8659", "#3FA073", "#52B788"] }
  ],
  pastel: [
    { name: "Soft Pastels", colors: ["#FFB3BA", "#FFCCCB", "#FFFFBA", "#BAE1FF", "#E0BBE4"] },
    { name: "Dreamy", colors: ["#FCB4D5", "#F8E0F0", "#D4F1F4", "#B8E6F0", "#E8D5F2"] }
  ],
  vibrant: [
    { name: "Neon Lights", colors: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"] },
    { name: "Electric", colors: ["#FF1654", "#FF5633", "#FF9233", "#33FF12", "#00D9FF"] }
  ],
  cool: [
    { name: "Ice Blue", colors: ["#E0F4FF", "#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6"] },
    { name: "Cool Tones", colors: ["#0D47A1", "#1565C0", "#1976D2", "#1E88E5", "#2196F3"] }
  ]
};

// Event Listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  validateAndSearch(query);
});

// Allow Enter key to search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    validateAndSearch(query);
  }
});

/**
 * Validate input before API call
 */
function validateAndSearch(query) {
  errorMsg.textContent = "";
  resultsDiv.innerHTML = "";

  if (query === "") {
    errorMsg.textContent = "Please enter a search term.";
    return;
  }

  fetchPalettes(query);
}

/**
 * Fetch palettes from local database or generate random ones
 */
async function fetchPalettes(query) {
  setLoading(true);

  try {
    let results = [];

    // Check if query matches local database
    const lowerQuery = query.toLowerCase();
    const matchedKey = Object.keys(paletteDatabase).find(key => 
      key.includes(lowerQuery) || lowerQuery.includes(key)
    );

    if (matchedKey) {
      results = paletteDatabase[matchedKey];
    } else {
      // If no match found, suggest popular categories
      errorMsg.textContent = `No palettes found for "${query}". Try: sunset, ocean, forest, pastel, vibrant, or cool`;
      setLoading(false);
      return;
    }

    if (!results || results.length === 0) {
      errorMsg.textContent = "No results found.";
      setLoading(false);
      return;
    }

    displayPalettes(results);
  } catch (error) {
    console.error("Error:", error);
    errorMsg.textContent = "Error loading palettes. Please try again.";
  } finally {
    setLoading(false);
  }
}

/**
 * Display palette cards in DOM
 */
function displayPalettes(palettes) {
  palettes.forEach(palette => {
    const card = document.createElement("div");
    card.className = "palette-card";

    const colorsDiv = document.createElement("div");
    colorsDiv.className = "colors";

    palette.colors.forEach(color => {
      const colorDiv = document.createElement("div");
      colorDiv.className = "color";
      colorDiv.style.backgroundColor = color;
      colorDiv.title = color; // Show hex code on hover
      
      // Copy color to clipboard on click
      colorDiv.addEventListener("click", () => {
        copyToClipboard(color);
      });
      
      colorsDiv.appendChild(colorDiv);
    });

    const name = document.createElement("div");
    name.className = "palette-name";
    name.textContent = palette.name || "Untitled";

    card.appendChild(colorsDiv);
    card.appendChild(name);
    resultsDiv.appendChild(card);
  });
}

/**
 * Copy color to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show temporary feedback
    const prevErrorText = errorMsg.textContent;
    errorMsg.textContent = `Copied ${text} to clipboard!`;
    errorMsg.style.color = "green";
    setTimeout(() => {
      errorMsg.textContent = prevErrorText;
      errorMsg.style.color = "red";
    }, 2000);
  });
}

/**
 * Loading state handler
 */
function setLoading(isLoading) {
  loadingText.classList.toggle("hidden", !isLoading);
  searchBtn.disabled = isLoading;
}
