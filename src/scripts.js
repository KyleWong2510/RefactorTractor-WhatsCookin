// import users from './data/users-data'; // these will change to API's, get requests
// import recipeData from  './data/recipe-data';
// import ingredientsData from './data/ingredient-data';

import './css/base.scss';
import './css/styles.scss';
import './images/search.png';
import './images/apple-logo-outline.png';
import './images/apple-logo.png';
import './images/cookbook.png';
import './images/seasoning.png';
import './images/checklistwhite.png';

import User from './user';
import Recipe from './recipe';
import Pantry from './pantry';

let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let tagList = document.querySelector(".tag-list");

let users;
let recipeData;
let ingredientsData;

let menuOpen = false;
let user;
let pantry;
let allRecipes = [];

allRecipesBtn.addEventListener("click", showAllRecipes);
filterBtn.addEventListener("click", filterRecipesOnPage);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("submit", pressEnterSearch);

const onloadHandler = () => {
  generateUser();
  findTags();
  createCards();
}

const fetchData = () => {
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



// GENERATE A USER ON LOAD
function generateUser() {
  user = new User(users[Math.floor(Math.random() * users.length)]);
  pantry = new Pantry(user);
  let firstName = user.name.split(" ")[0];
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
    welcomeMsg);
  findPantryInfo();
}

// CREATE RECIPE CARDS
//put instantiation somewhere else, maybe in promise?
function createCards() {
  recipeData.forEach(recipe => {
    let currentRecipe = new Recipe(recipe);
    let shortRecipeName = currentRecipe.name;
    allRecipes.push(currentRecipe);
    if (currentRecipe.name.length > 40) {
      shortRecipeName = currentRecipe.name.substring(0, 40) + "...";
    }
    addToDom(currentRecipe, shortRecipeName)
  });
}

function addToDom(currentRecipe, shortRecipeName) {
  let cardHtml = `
    <div class="recipe-card" id=${currentRecipe.id}>
      <h3 maxlength="40">${shortRecipeName}</h3>
      <div class="card-photo-container">
        <img src=${currentRecipe.image} class="card-photo-preview" alt="${currentRecipe.name} recipe" title="${currentRecipe.name} recipe">
        <div class="text">
          <div>Click for Instructions</div>
        </div>
			</div>
			<div>${tagsToList(currentRecipe.tags)}</div>
      <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
    </div>`
  main.insertAdjacentHTML("beforeend", cardHtml);
}

function tagsToList(tagsList) {
  return tagsList.map(tag => `<h4>${tag}</h4>`);
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
  listTags(tags);
}

function listTags(allTags) {
  allTags.forEach(tag => {
    let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
      <label for="${tag}">${capitalize(tag)}</label></li>`;
    tagList.insertAdjacentHTML("beforeend", tagHtml);
  });
}

function capitalize(words) {
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function filterRecipesOnPage() {
  if (document.querySelector('.welcome-msg').style.display !== 'none') {
    findCheckedBoxes(allRecipes)
  }
  if (document.querySelector(".my-recipes-banner").style.display !== 'none') {
    findCheckedBoxes(user.favoriteRecipes)
  }
  //if banner is cooknext then
  // findCheckedBoxes(user.recipesToCook)
}

function findCheckedBoxes(arr) {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags, arr);
}

//Make these dynamic so we can pass in different arrays to filter through
//Must have a way to indicate what view we are on => banner?

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
      showMyRecipesBanner()
    }
    // } else {
    //show toDoList banner
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
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    let card = recipeData.find(recipe => recipe.id === cardId)
    if (!user.favoriteRecipes.includes(card)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(card, 'favoriteRecipes');
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(card, 'favoriteRecipes');
    }
  } else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

function isDescendant(parent, child) {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
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
  let recipeId = event.path.find(e => e.id).id;
  let clickedRecipe = allRecipes.find(clickedRecipe => clickedRecipe.id === Number(recipeId));
  generateRecipeTitle(clickedRecipe, generateIngredients(clickedRecipe));
  addRecipeImage(clickedRecipe);
  generateInstructions(clickedRecipe);
  fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
}

function generateRecipeTitle(clickedRecipe, ingredients) {
  const ingredCost = clickedRecipe.calculateIngredCost(ingredientsData);
  let recipeTitle = `
    <button id="exit-recipe-btn">X</button>
    <h3 id="recipe-title">${clickedRecipe.name}</h3>
    <h4>Ingredients</h4>
		<p>${ingredients}</p>
		<h4>Ingredients Esimated Cost</h4>
		<p>$${ingredCost}</p>`
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
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

// TOGGLE DISPLAYS
function showMyRecipesBanner() {
  document.querySelector(".welcome-msg").style.display = "none";
  document.querySelector(".my-recipes-banner").style.display = "block";
}

function showWelcomeBanner() {
  document.querySelector(".welcome-msg").style.display = "flex";
  document.querySelector(".my-recipes-banner").style.display = "none";
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  showAllRecipes();
  const search = searchInput.value.toLowerCase()
  const results = user.searchForRecipe(search, recipeData)
  filterNonSearched(createRecipeObject(results));
}

function filterNonSearched(filtered) {
  let found = allRecipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  hideUnselectedRecipes(found);
}

function createRecipeObject(recipes) {
  return recipes.map(recipe => new Recipe(recipe));
}

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

// CREATE AND USE PANTRY
function findPantryInfo() {
  displayPantryInfo(pantry.data.sort((a, b) => a.name - b.name));
}

function displayPantryInfo(pantry) {
  pantry.forEach(ingredient => {
    const ingredName = ingredientsData.find(ingred => ingred.id === ingredient.ingredient).name;

    const ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredName}">
      <label for="${ingredName}">${ingredName}, ${ingredient.amount}</label></li>`;
    document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
      ingredientHtml);
  });
}

function findCheckedPantryBoxes() {
  const pantryCheckboxes = Array.from(document.querySelectorAll(".pantry-checkbox"));
  const selectedIngredients = pantryCheckboxes.filter(box => box.checked);

  showAllRecipes();
  if (selectedIngredients.length) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

function findRecipesWithCheckedIngredients(selected) {
  const recipeChecker = (recipeI, target) => target.every(iName => recipeI.includes(iName));
  const ingredientNames = selected.map(item => item.id)

  recipeData.forEach(recipe => {
    const allRecipeI = recipe.ingredients.map(ingred =>
      ingredientsData.find(i => i.id === ingred.id).name);

    if (!recipeChecker(allRecipeI, ingredientNames)) {
      const domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    }
  })
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
    return ingred.name.includes(search)})
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

document.addEventListener('click', function(e) {
  if(e.target && e.target.id === 'search-ingredients-btn') {
    createPostForm()
  }
})

document.addEventListener('click', function(e) {
  if(e.target && e.target.id === 'save-changes-btn') {
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

// document.getElementById('search-ingredients-btn').addEventListener('click', createPostForm)
document.getElementById('save-changes-btn').addEventListener('click', togglePostForm)
document.getElementById('modify-pantry-btn').addEventListener('click', togglePostForm)