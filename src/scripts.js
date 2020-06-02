import './css/base.scss';
import './css/styles.scss';
import './images/search.png';
import './images/apple-logo-outline.png';
import './images/apple-logo.png';
import './images/cookbook.png';
import './images/seasoning.png';
import './images/recipe.png';
import './images/recipegreen.png';
import './images/recipeblack.png';
import './images/menu.svg';
import './images/x.svg';

import User from './user';
import Recipe from './recipe';
import Pantry from './pantry';
import domUpdates from './domUpdates';


const fullRecipeInfo = document.querySelector(".recipe-instructions");
const main = document.querySelector("main");
const menuButton = document.querySelector('.menu-button');
const menuCloseButton = document.querySelector('.menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuBody = document.querySelector('.menu-body-text');

let users;
let recipeData;
let ingredientsData;
let user;
let pantry;
let allRecipes = [];
let menuOpen = false;

window.addEventListener("load", fetchData);

main.addEventListener("click", () => domUpdates.addToMyRecipes(recipeData, user, fullRecipeInfo, allRecipes, ingredientsData, pantry));
menuButton.addEventListener('click', openMobileMenu);
menuCloseButton.addEventListener('click', closeMobileMenu);

document.getElementById("search").addEventListener("submit", () => {searchRecipes(event)});
document.getElementById("mobile-search").addEventListener("submit", () => {searchRecipes(event)});
document.getElementById('save-changes-btn').addEventListener('click', hidePostForm);
document.getElementById('modify-pantry-btn').addEventListener('click', showPostForm);

document.querySelector(".search-btn").addEventListener("click", () => {searchRecipes(event)});
document.querySelector(".mobile-search-btn").addEventListener("click", () => {searchRecipes(event)});

document.querySelectorAll(".show-all-btn").forEach(bt => bt.addEventListener("click", () => domUpdates.showAllRecipes(allRecipes)(allRecipes)));
document.querySelectorAll(".saved-recipes-btn").forEach(bt => bt.addEventListener("click", () => domUpdates.showSavedRecipes(allRecipes, recipeData, user)));
document.querySelectorAll(".saved-recipes-to-cook").forEach(bt => bt.addEventListener("click", () => domUpdates.showToCookItems(allRecipes, recipeData, user)));
document.querySelectorAll(".filter-btn").forEach(bt => bt.addEventListener("click", () => domUpdates.filterRecipesOnPage(allRecipes, user)));
document.querySelectorAll(".my-pantry-btn").forEach(bt => bt.addEventListener("click", toggleMenu));

document.addEventListener('click', (e) => {createPostForm(e)});
document.addEventListener('click', (e) => {submitPantryChanges(e)});
document.addEventListener('click', (e) => {modifyIngredientCount(e)});

function submitPantryChanges(e) {
  if (e.target && e.target.id === 'save-changes-btn') {
    let amounts = Array.from(document.querySelectorAll('.amount'));
    amounts.forEach(amount => {
      if (amount.value && amount.value !== 0) {
        let ingredID = amount.parentNode.parentNode.id;
        let ingredMod = amount.value;
        adjustPantry(ingredID, ingredMod);
      }
    })
  }
}

function modifyIngredientCount(e) {
  if (e.target && e.target.id === 'minus') {
    domUpdates.subtractIngredientCount(e);
  }
  if (e.target && e.target.id === 'plus') {
    domUpdates.addIngredientCount(e);
  }
}

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
    .catch(err => console.log('Alert, something\'s wrong with your endpoint!', err.message));

  ingredientsData = fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData')
    .then(response => response.json())
    .catch(err => console.log('Alert, something\'s wrong with your endpoint!', err.message));

  recipeData = fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .catch(err => console.log('Alert, something\'s wrong with your endpoint!', err.message));

  return Promise.all([users, ingredientsData, recipeData])
    .then(response => {
      users = response[0].wcUsersData;
      ingredientsData = response[1].ingredientsData;
      recipeData = response[2].recipeData;
    })
    .then(onloadHandler)
    .catch(error => console.log(error))
}

//MOBILE MEDIA QUERY
function openMobileMenu() {
  mobileMenuBody.classList.remove('hide');
  mobileMenuBody.classList.add('menu-body-style');
  mobileMenu.classList.add('open-style');
  menuButton.classList.add('hide');
	menuCloseButton.classList.remove('hide');
	main.classList.add('gray-1');
	document.querySelector('.mobile-cards').classList.add('gray-1');
	document.querySelector('.banner-image').classList.add('gray-1');
	document.querySelector('.mobile-filter-btn').addEventListener('click', openFilterBar);
	document.querySelector('.main-title').addEventListener('click', () => domUpdates.showAllRecipes(allRecipes));
}

function openFilterBar() {
  document.querySelector('.mobile-wrap').classList.remove('hide');
  document.querySelector('.filter-btn').addEventListener('click', () => {document.querySelector('.mobile-wrap').classList.add('hide')})
}

function closeMobileMenu() {
  mobileMenuBody.classList.add('hide');
  mobileMenuBody.classList.remove('menu-body-style');
  mobileMenu.classList.remove('open-style');
  menuButton.classList.remove('hide');
	menuCloseButton.classList.add('hide');
	document.querySelector('.mobile-wrap').classList.add('hide');
	document.querySelector(".drop-menu").style.display = "none";
	main.classList.remove('gray-1');
	document.querySelector('.mobile-cards').classList.remove('gray-1');
	document.querySelector('.banner-image').classList.remove('gray-1');}

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

// SEARCH RECIPES
function searchRecipes(event) {
  event.preventDefault();
  const search = document.querySelector("#search-input").value.toLowerCase() || document.querySelector("#mobile-search-input").value.toLowerCase();
  if (document.querySelector('.welcome-msg').style.display !== 'none') {
    let results = user.searchForRecipe(search, recipeData);
    filterNonSearched(results);
  }
  if (document.querySelector(".my-recipes-banner").style.display !== 'none') {
    let results = user.searchForRecipe(search, user.favoriteRecipes);
    filterNonSearched(results);
  }
  if (document.querySelector(".to-cook-banner").style.display !== 'none') {
    let results = user.searchForRecipe(search, user.recipesToCook);
    filterNonSearched(results);
  }
}

function filterNonSearched(filtered) {
  let found = recipeData.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id);
  })
  domUpdates.hideUnsearched(found, allRecipes);
}

//POST FORM FUNCTIONALITY
function showPostForm() {
  document.getElementById('searched-ingredient-results').innerHTML = '';
  document.getElementById('search-ingredients-input').value = '';
  document.getElementById('post-to-pantry').style.display = 'flex';
}

function searchPantry() {
  const searchIngredientsInput = document.getElementById('search-ingredients-input');
  const search = searchIngredientsInput.value.toLowerCase();
  return ingredientsData.filter(ingred => ingred.name).filter(ingred => ingred.name.includes(search));
}

function createPostForm(e) {
  if (e.target && e.target.classList.contains('search-ingredients-btn')) {
    let ingredients = searchPantry();
    domUpdates.displaySearchedIngreds(ingredients);
  }
}

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
    .then(hidePostForm())
    .catch(error => console.log(error))
}

function hidePostForm() {
  document.getElementById('post-to-pantry').style.display = 'none';

  users = fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData')
    .then(response => response.json())
    .catch(err => alert('Alert, something\'s wrong with your endpoint!', err.message));

  return Promise.resolve(users)
    .then(response => {
      users = response.wcUsersData;
      let id = user.id;
      user = new User(users[id - 1]);
      pantry = new Pantry(user);
    })
    .then(() => domUpdates.displayPantryInfo(pantry.data, ingredientsData))
    .catch(error => console.log(error))   
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