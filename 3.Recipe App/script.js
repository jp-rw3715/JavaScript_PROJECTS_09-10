const loader = document.getElementById("loader");
const recipeGrid = document.getElementById("recipeGrid");
const modalBg = document.getElementById("modalBg");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");

const UNIQUE_IDS = [11, 15, 18, 21, 25];
let orderedRecipeId = null; // Recipe user ordered (selected)

// Create unique animated custom alert style element
const customAlert = document.createElement("div");
customAlert.className =
  "fixed z-50 top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-3xl shadow-xl text-xl flex items-center gap-3 opacity-0 transition-all duration-500 select-none";
customAlert.innerHTML = `<span class="animate-bounce text-2xl">🍽️</span> <span id="alertMsg"></span>`;
document.body.appendChild(customAlert);

function showCustomAlert(msg) {
  document.getElementById("alertMsg").textContent = msg;
  customAlert.style.opacity = "1";
  customAlert.style.pointerEvents = "auto";
  setTimeout(() => {
    customAlert.style.opacity = "0";
    customAlert.style.pointerEvents = "none";
  }, 2400);
}

async function fetchUniqueRecipes() {
  loader.classList.remove("hidden");
  recipeGrid.innerHTML = "";

  try {
    const resp = await fetch("https://dummyjson.com/recipes");
    const { recipes } = await resp.json();
    loader.classList.add("hidden");
    return recipes.filter((r) => UNIQUE_IDS.includes(r.id));
  } catch {
    loader.classList.add("hidden");
    recipeGrid.innerHTML = `<div class="col-span-full text-red-600 font-bold text-center py-8">Failed to load recipes.</div>`;
    return [];
  }
}

function makeCard(recipe) {
  const c = document.createElement("div");
  c.className =
    "bg-white/80 backdrop-blur rounded-2xl drop-shadow-2xl hover:scale-105 transition-all duration-300 p-5 flex flex-col items-center cursor-pointer animate-fadeIn";
  c.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.name}"
      class="rounded-full w-24 h-24 mb-2 border-4 border-pink-100 shadow" />
    <div class="text-lg font-bold text-emerald-700 text-center mb-1">${
      recipe.name
    }</div>
    <p class="text-xs text-gray-400">Preview</p>
    <ul class="hidden sm:block text-pink-700 list-disc ml-5 mb-2">${recipe.ingredients
      .slice(0, 2)
      .map((i) => `<li>${i}</li>`)
      .join("")}</ul>
    <div class="flex gap-2 mt-auto">
      <button class="order-btn bg-lime-500 hover:bg-lime-600 text-white rounded-full px-4 py-1.5 font-semibold shadow transition duration-200">Order</button>
      <button class="details-btn bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-1.5 font-semibold shadow transition duration-200">Details</button>
    </div>
  `;
  // Handle Order click
  c.querySelector(".order-btn").onclick = (e) => {
    e.stopPropagation();
    orderedRecipeId = recipe.id;
    showCustomAlert(
      `Menu Selected: "${recipe.name}"! 📝 Now you can view details.`
    );
  };
  // Handle Details click
  c.querySelector(".details-btn").onclick = (e) => {
    e.stopPropagation();
    if (orderedRecipeId === recipe.id) {
      openModal(recipe);
    } else {
      const phrases = [
        "🍕 Please select your menu first before viewing the recipe details!",
        "😋 Hungry? Choose your dish before checking out the details!",
        "🥘 To see the recipe, kindly make your menu selection first.",
        "🍽️ Pick your favorite menu item to unlock the recipe details!",
        "🔥 Menu selection needed! Choose your dish to dive into the recipe.",
      ];
      showCustomAlert(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  };
  return c;
}

function openModal(recipe) {
  modalTitle.textContent = recipe.name;
  modalImg.src = recipe.image;
  modalIngredients.innerHTML = recipe.ingredients
    .map((i) => `<li>${i}</li>`)
    .join("");
  modalInstructions.textContent = recipe.instructions;
  modalBg.classList.remove("hidden");
}

function closeModal() {
  modalBg.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
modalBg.addEventListener("click", (e) => {
  if (e.target === modalBg) closeModal();
});

(async () => {
  const recipes = await fetchUniqueRecipes();
  recipes.forEach((r) => recipeGrid.appendChild(makeCard(r)));
})();
