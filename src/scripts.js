import './css/base.scss';
import './css/styles.scss';
import './images/search.png';
import './images/apple-logo-outline.png';
import './images/apple-logo.png';
import './images/cookbook.png';
import './images/seasoning.png';
import './images/recipe.png'
import './images/recipegreen.png'
import './images/recipeblack.png'

import User from './user';
import Recipe from './recipe';
import Pantry from './pantry';
import domUpdates from './domUpdates';

let allRecipesBtn = document.querySelectorAll(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let recipesToCkBtn = document.querySelector(".saved-recipes-to-cook");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");

let users;
let recipeData;
let ingredientsData;
let user;
let pantry;
let allRecipes = [];
let menuOpen = false;

allRecipesBtn.forEach(bt => bt.addEventListener("click", showAllRecipes));
recipesToCkBtn.addEventListener("click", showToCookItems);
filterBtn.addEventListener("click", filterRecipesOnPage);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
searchForm.addEventListener("submit", pressEnterSearch);
mainTitle.addEventListener('click', showAllRecipes)
document.addEventListener('click', function (event) {
  if (event.target.src.includes('/images/recipe.png')) {
    showToCookItems()
  }
})

function onloadHandler() {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  pantry = new Pantry(user);
  domUpdates.welcomeUser(user, pantry, ingredientsData);
  findTags();
  createCards();
}

function fetchData() {
  users = fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData')
    .then(response => response.json())
    .catch(err => alert('Alert, something\'s wrong with your endpoint!', err.message))
	
  ingredientsData = fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData')
    .then(response => response.json())
    .catch(err => alert('Alert, something\'s wrong with your endpoint!', err.message))
	
  recipeData = fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .catch(err => alert('Alert, something\'s wrong with your endpoint!', err.message))

  return Promise.all([users, ingredientsData, recipeData])
    .then(response => {
      users = response[0].wcUsersData;
      ingredientsData = response[1].ingredientsData;
      recipeData = response[2].recipeData;
    })
    .then(onloadHandler)
    .catch(error => console.log(error))
}

window.addEventListener("load", fetchData);

// CREATE RECIPE CARDS
function createCards() {
  recipeData.forEach(recipe => {
    let currentRecipe = new Recipe(recipe);
    let shortRecipeName = currentRecipe.name;
    allRecipes.push(currentRecipe);
    if (currentRecipe.name.length > 40) {
      shortRecipeName = currentRecipe.name.substring(0, 40) + "...";
    }
    domUpdates.displayRecipeCards(currentRecipe, shortRecipeName);
  });
}

// FILTER BY RECIPE TAGS
function findTags() {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  domUpdates.listTags(tags);
}

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function filterRecipesOnPage() {
  if (document.querySelector('.welcome-msg').style.display !== 'none') {
    findCheckedBoxes(allRecipes);
  }
  if (document.querySelector(".my-recipes-banner").style.display !== 'none') {
    findCheckedBoxes(user.favoriteRecipes);
	}
	if (document.querySelector(".to-cook-banner").style.display !== 'none') {
    findCheckedBoxes(user.recipesToCook);
  }
}

function findCheckedBoxes(arr) {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags, arr);
}

function findTaggedRecipes(selected, arr) {
  let filteredResults = [];
  selected.forEach(tag => {
    let recipes = arr.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    recipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  showFilteredRecipes(arr)
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults, arr);
  }
}

function showFilteredRecipes(arr) {
  showAllRecipes()
  if (arr !== allRecipes) {
    let unsavedRecipes = recipeData.filter(recipe => {
      return !arr.includes(recipe);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    if (arr === user.favoriteRecipes) {
      showMyRecipesBanner();
    } else {
			showToCookBanner();
		}
  }
}

function filterRecipes(filtered, arr) {
  let foundRecipes = arr.filter(recipe => {
    return !filtered.includes(recipe);
  });
  hideUnselectedRecipes(foundRecipes)
}

function hideUnselectedRecipes(foundRecipes) {
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

// FAVORITE RECIPE FUNCTIONALITY
function addToMyRecipes() {
  if (event.target.className === "recipe-icon-card") { addToCookList() }
  else if (event.target.className === "card-apple-icon") { addToFavorites() }
  else if (event.target.id === "exit-recipe-btn") { exitRecipe() }
  else if (event.target.id === "instructions") { openRecipeInfo(event) }
}

function addToCookList() {
  let cardId = parseInt(event.target.closest(".recipe-card").id)
  let card = recipeData.find(recipe => recipe.id === cardId);
  if (!user.recipesToCook.includes(card)) {
    event.target.src = "../images/recipeblack.png";
    user.saveRecipe(card, 'recipesToCook');
  } else {
    event.target.src = "../images/recipegreen.png";
    user.removeRecipe(card, 'recipesToCook');
  }
  // Here is a bug
}

function addToFavorites() {
  let cardId = parseInt(event.target.closest(".recipe-card").id)
  let card = recipeData.find(recipe => recipe.id === cardId)
  if (!user.favoriteRecipes.includes(card)) {
    event.target.src = "../images/apple-logo.png";
    user.saveRecipe(card, 'favoriteRecipes');
  } else {
    event.target.src = "../images/apple-logo-outline.png";
    user.removeRecipe(card, 'favoriteRecipes');
  }
}

function showSavedRecipes() {
  showAllRecipes()
  let unsavedRecipes = recipeData.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.style.display = "inline";
  let recipeId = parseInt(event.target.closest(".recipe-card").id);
  let clickedRecipe = allRecipes.find(clickedRecipe => clickedRecipe.id === Number(recipeId));
  generateRecipeTitle(clickedRecipe, generateIngredients(clickedRecipe));
  addRecipeImage(clickedRecipe);
  generateInstructions(clickedRecipe);
  fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
}

function generateRecipeTitle(clickedRecipe, ingredients) {
  const ingredCost = clickedRecipe.calculateIngredCost(ingredientsData);
  const ownedIngreds = pantry.checkPantry(clickedRecipe, ingredientsData);
  const missingIngreds = pantry.findIngredsMissing(clickedRecipe, ingredientsData);
	
  let recipeTitle = `
    <button id="exit-recipe-btn">X</button>
    <h3 id="recipe-title">${clickedRecipe.name}</h3>
    <h4>Ingredients</h4>
		<p>${ingredients}</p>
		<h4>Esimated Cost</h4>
		<p>$${ingredCost}</p>
		<h4>Ingredients You Own</h4>
		<p>${ownedIngreds}</p>
		<h4>Ingredients You're Missing</h4>
		<p>${missingIngreds}</p>`
  fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
}

function addRecipeImage(clickedRecipe) {
  document.getElementById("recipe-title").style.backgroundImage = `url(${clickedRecipe.image})`;
}

function generateIngredients(clickedRecipe) {
  return clickedRecipe && clickedRecipe.ingredients.map(i => {
    let foundIngredient = ingredientsData.find(ingredient => 
      ingredient.id === i.id).name;
    return `${capitalize(foundIngredient)} (${i.quantity.amount} ${i.quantity.unit})`
  }).join(", ");
}

function generateInstructions(clickedRecipe) {
  let instructionsList = "";
  clickedRecipe.instructions.forEach(i => {
    instructionsList += `<li>${i.instruction}</li>`
  });
  fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
  fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
}

function exitRecipe() {
  while (fullRecipeInfo.firstChild && fullRecipeInfo.removeChild(fullRecipeInfo.firstChild)) {

  }
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

// TOGGLE DISPLAYS
function showMyRecipesBanner() {
  document.querySelector('.to-cook-banner').style.display = 'none';
  document.querySelector(".welcome-msg").style.display = "none";
  document.querySelector(".my-recipes-banner").style.display = "block";
}

function showToCookBanner() {
  document.querySelector(".my-recipes-banner").style.display = "none";
  document.querySelector('.welcome-msg').style.display = 'none';
  document.querySelector('.to-cook-banner').style.display = 'block'
}

function showWelcomeBanner() {
  document.querySelector('.to-cook-banner').style.display = 'none';
  document.querySelector(".my-recipes-banner").style.display = "none";
  document.querySelector(".welcome-msg").style.display = "flex";
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  const search = searchInput.value.toLowerCase();
  if (document.querySelector('.welcome-msg').style.display !== 'none') {
    let results = user.searchForRecipe(search, recipeData);
    console.log(results);
    filterNonSearched(results);
  }
  if (document.querySelector(".my-recipes-banner").style.display !== 'none') {
    let results = user.searchForRecipe(search, user.favoriteRecipes);
    filterNonSearched(results);
	}
	if (document.querySelector(".to-cook-banner").style.display !== 'none') {
    let results = user.searchForRecipe(search, user.recipesToCook);
    filterNonSearched(results)
  }
}

function filterNonSearched(filtered) {
  let found = recipeData.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  hideUnsearched(found);
}

function hideUnsearched(foundRecipes) {
  showAllRecipes();
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}
// function createRecipeObject(recipes) {
//   return recipes.map(recipe => new Recipe(recipe));
// }

function toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display = "block";
  } else {
    menuDropdown.style.display = "none";
  }
}

function showAllRecipes() {
  allRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  showWelcomeBanner();
}

//POST FORM FUNCTIONALITY
function togglePostForm() {
  document.getElementById('post-to-pantry').classList.toggle('hide')
}

const searchIngredientsInput = document.getElementById('search-ingredients-input')

function searchPantry() {
  const search = searchIngredientsInput.value.toLowerCase();
  return ingredientsData.filter(ingred => ingred.name).filter(ingred => {
    console.log(ingred.name)
    return ingred.name.includes(search)
  })
}

function displaySearchedIngredients(ingredients) {
  let results = document.getElementById('searched-ingredient-results')
  results.innerHTML = ''

  ingredients.forEach(ingred => {
    results.insertAdjacentHTML('afterbegin', `
      <div class="searched-ingredient" id="${ingred.id}">
        <div id="add-subtract">
          <button id="minus">-</button>
          <input id="amount" placeholder="0">
          <button id="plus">+</button>
        </div>
        <p>${ingred.name}</p>
      </div>
    `)
  })
}

function createPostForm() {
  let ingredients = searchPantry()
  displaySearchedIngredients(ingredients)
}

function showToCookItems() {
  showAllRecipes();
  let unsavedRecipes = recipeData.filter(recipe => {
    return !user.recipesToCook.includes(recipe);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  showToCookBanner()
}

document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'search-ingredients-btn') {
    createPostForm()
  }
})

document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'save-changes-btn') {
    let amounts = Array.from(document.querySelectorAll('#amount'))
    amounts.forEach(amount => {
      if (amount.value && amount.value !== 0) {
        let ingredID = amount.parentNode.parentNode.id
        let ingredMod = amount.value
        adjustPantry(ingredID, ingredMod)
      }
    })
  }
})

function adjustPantry(ingredID, ingredMod) {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userID: user.id,
      ingredientID: +ingredID,
      ingredientModification: +ingredMod
    })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

document.getElementById('save-changes-btn').addEventListener('click', togglePostForm)
document.getElementById('modify-pantry-btn').addEventListener('click', togglePostForm)


function addToRecipes() {
  const cardId = event.target.parentNode.parentNode.id
  let current = recipeData.find(data => data.id == cardId)
  if (event.target.src.includes('/images/recipeblack.png')) {
    event.target.src = '../images/recipegreen.png'
    let position = user.recipesToCook.indexOf(current)
    user.recipesToCook.splice(position, 1)
  } else {
    event.target.src = '../images/recipeblack.png'
    user.recipesToCook.push(current)
  }
}



