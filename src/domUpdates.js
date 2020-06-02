let domUpdates = {
  welcomeUser(user, pantry, ingredientsData) {
    let firstName = user.name.split(" ")[0];
    let welcomeMsg = `
		<div class="welcome-msg">
		<h1>Welcome ${firstName}!</h1>
		</div>`;
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
      welcomeMsg);
    this.displayPantryInfo(pantry.data, ingredientsData);
  },

  displayPantryInfo(pantry, ingredientsData) {
    let pantryList = document.querySelector(".pantry-list")
		pantryList.innerHTML = '';
    pantry.forEach(ingredient => {
      const ingredName = ingredientsData.find(ingred => ingred.id === ingredient.ingredient).name;
      const ingredientHtml = `<li>${ingredName}, ${ingredient.amount}</li>`;
      pantryList.insertAdjacentHTML("beforeend",
        ingredientHtml);
    });
  },

  displayRecipeCards(currentRecipe, shortRecipeName) {
    let cardContainer = document.querySelector('.recipe-card-container');
    let tagsToList = currentRecipe.tags.map(tag => `<h4>${tag}</h4>`);

    // Div id 'instructions' could be changed to improve aria score.
    let cardHtml = `
    <div class="recipe-card" id=${currentRecipe.id}>
      <h3 maxlength="40">${shortRecipeName}</h3>
      <div class="card-photo-container">
        <img src=${currentRecipe.image} class="card-photo-preview" alt="${currentRecipe.name} recipe" title="${currentRecipe.name} recipe">
        <div class="text">
          <div class="instructions">Click for Instructions</div>
        </div>
			</div>
      <div>${tagsToList}</div>
      <div class="button-holder">
      	<img src="../images/recipegreen.png" class="recipe-icon-card" alt="recipes to cook icon"/>
      	<img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>
    </div>`
    cardContainer.insertAdjacentHTML("beforeend", cardHtml);
  },

  listTags(allTags) {
    let tagList = document.querySelectorAll(".tag-list");
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
				<label for="${tag}">${this.capitalize(tag)}</label></li>`;
      tagList.forEach(t => t.insertAdjacentHTML("beforeend", tagHtml));
    })
  },

  capitalize(words) {
    return words.split(" ").map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  },

  //Changes as of 5/28
  filterRecipesOnPage(allRecipes, user, recipeData) {
    if (document.querySelector('.welcome-msg').style.display !== 'none') {
      this.findCheckedBoxes(allRecipes, allRecipes, recipeData, user)
    }
    if (document.querySelector(".my-recipes-banner").style.display !== 'none') {
      this.findCheckedBoxes(user.favoriteRecipes, allRecipes, recipeData, user)
    }
    if (document.querySelector(".to-cook-banner").style.display !== 'none') {
      this.findCheckedBoxes(user.recipesToCook, allRecipes, recipeData, user);
    }
  },

  //not really dom updates...how can this live in scripts?
  findCheckedBoxes(arr, allRecipes, recipeData, user) {
    let tagCheckboxes = document.querySelectorAll(".checked-tag");
    let checkboxInfo = Array.from(tagCheckboxes)
    let selectedTags = checkboxInfo.filter(box => {
      return box.checked;
    })
    this.findTaggedRecipes(selectedTags, arr, allRecipes, recipeData, user);
  },

  findTaggedRecipes(selected, arr, allRecipes, recipeData, user) {
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
    this.showFilteredRecipes(arr, allRecipes, recipeData, user)
    if (filteredResults.length > 0) {
      this.filterRecipes(filteredResults, arr);
    }
  },
  // Too many params
  showFilteredRecipes(arr, allRecipes, recipeData, user) {
    this.showAllRecipes(allRecipes)
    if (arr !== allRecipes) {
      let unsavedRecipes = recipeData.filter(recipe => {
        return !arr.includes(recipe);
      });
      unsavedRecipes.forEach(recipe => {
        let domRecipe = document.getElementById(`${recipe.id}`);
        domRecipe.style.display = "none";
      });
      if (arr === user.favoriteRecipes) {
        this.showMyRecipesBanner()
      } else if (arr === user.recipesToCook) {
        this.showToCookBanner()
      }
    }
  },

  showAllRecipes(allRecipes) {
    allRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "block";
    });
    this.showWelcomeBanner();
  },

  showWelcomeBanner() {
    document.querySelector('.to-cook-banner').style.display = 'none';
    document.querySelector(".my-recipes-banner").style.display = "none";
    document.querySelector(".welcome-msg").style.display = "flex";
  },

  showMyRecipesBanner() {
    document.querySelector('.to-cook-banner').style.display = 'none';
    document.querySelector(".welcome-msg").style.display = "none";
    document.querySelector(".my-recipes-banner").style.display = "block";
  },

  showToCookBanner() {
    document.querySelector(".my-recipes-banner").style.display = "none";
    document.querySelector('.welcome-msg').style.display = 'none';
    document.querySelector('.to-cook-banner').style.display = 'block'
  },

  filterRecipes(filtered, arr) {
    let foundRecipes = arr.filter(recipe => {
      return !filtered.includes(recipe);
    });
    this.hideUnselectedRecipes(foundRecipes)
  },

  hideUnselectedRecipes(foundRecipes) {
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

  showSavedRecipes(allRecipes, recipeData, user) {
    this.showAllRecipes(allRecipes)
    let unsavedRecipes = recipeData.filter(recipe => {
      return !user.favoriteRecipes.includes(recipe);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    this.showMyRecipesBanner();
  },

  showToCookItems(allRecipes, recipeData, user) {
    domUpdates.showAllRecipes(allRecipes);
    let unsavedRecipes = recipeData.filter(recipe => {
      return !user.recipesToCook.includes(recipe);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    domUpdates.showToCookBanner()
  },

  openRecipeInfo(event, fullRecipeInfo, allRecipes, ingredientsData, pantry) {
    fullRecipeInfo.style.display = "inline";
    let recipeId = parseInt(event.target.closest(".recipe-card").id);
    let clickedRecipe = allRecipes.find(clickedRecipe => clickedRecipe.id === Number(recipeId));
    this.generateRecipeTitle(clickedRecipe, this.generateIngredients(clickedRecipe, ingredientsData), ingredientsData, pantry, fullRecipeInfo);
    document.getElementById("recipe-title").style.backgroundImage = `url(${clickedRecipe.image})`;
    this.generateInstructions(clickedRecipe, fullRecipeInfo);
    fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
  },

  generateRecipeTitle(clickedRecipe, ingredients, ingredientsData, pantry, fullRecipeInfo) {
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
  },

  generateIngredients(clickedRecipe, ingredientsData) {
    return clickedRecipe && clickedRecipe.ingredients.map(i => {
      let foundIngredient = ingredientsData.find(ingredient =>
        ingredient.id === i.id).name;
      return `${this.capitalize(foundIngredient)} (${i.quantity.amount} ${i.quantity.unit})`
    }).join(", ");
  },

  generateInstructions(clickedRecipe, fullRecipeInfo) {
    let instructionsList = "";
    clickedRecipe.instructions.forEach(i => {
      instructionsList += `<li>${i.instruction}</li>`
    });
    fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
  },

  addToMyRecipes(recipeData, user, fullRecipeInfo, allRecipes, ingredientsData, pantry) {
    if (event.target.className === "recipe-icon-card") {
      this.addToCookList(recipeData, user)
    } else if (event.target.className === "card-apple-icon") {
      this.addToFavorites(recipeData, user)
    } else if (event.target.id === "exit-recipe-btn") {
      this.exitRecipe(fullRecipeInfo)
    } else if (event.target.className === "instructions") {
      this.openRecipeInfo(event, fullRecipeInfo, allRecipes, ingredientsData, pantry)
    }
  },
  // openRecipeInfo(event, fullRecipeInfo, allRecipes, ingredientsData, pantry) {


  addToCookList(recipeData, user) {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    let card = recipeData.find(recipe => recipe.id === cardId);
    if (!user.recipesToCook.includes(card)) {
      event.target.src = "../images/recipeblack.png";
      user.saveRecipe(card, 'recipesToCook');
    } else {
      event.target.src = "../images/recipegreen.png";
      user.removeRecipe(card, 'recipesToCook');
    }
  },

  addToFavorites(recipeData, user) {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    let card = recipeData.find(recipe => recipe.id === cardId)
    if (!user.favoriteRecipes.includes(card)) {
      event.target.src = "../images/apple-logo.png";
      user.saveRecipe(card, 'favoriteRecipes');
    } else {
      event.target.src = "../images/apple-logo-outline.png";
      user.removeRecipe(card, 'favoriteRecipes');
    }
  },
  //SHOULD THERE BE SOMETHING IN THE WHILE?
  exitRecipe(fullRecipeInfo) {
    while (fullRecipeInfo.firstChild && fullRecipeInfo.removeChild(fullRecipeInfo.firstChild)) {

    }
    fullRecipeInfo.style.display = "none";
    document.getElementById("overlay").remove();
  },

  hideUnsearched(foundRecipes, allRecipes) {
    this.showAllRecipes(allRecipes);
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

  toggleMenu(menuOpen) {
    var menuDropdown = document.querySelector(".drop-menu");
    menuOpen = !menuOpen;
    if (menuOpen) {
      menuDropdown.style.display = "block";
    } else {
      menuDropdown.style.display = "none";
    }
  },

  displaySearchedIngreds(ingreds) {
    let results = document.getElementById('searched-ingredient-results')
    results.innerHTML = ''

    ingreds.forEach(ingred => {
      results.insertAdjacentHTML('afterbegin', `
				<div class="searched-ingredient" id="${ingred.id}">
					<div id="add-subtract">
						<button id="minus">-</button>
						<input class="amount" placeholder="value..." value=0>
						<button id="plus">+</button>
					</div>
					<p id="ingred-name">${ingred.name}</p>
				</div>
			`)
    })
  },
	
  subtractIngredientCount(e) {
    let amount = e.target.nextSibling.nextSibling
    amount.value--
  },

  addIngredientCount(e) {
    let amount = e.target.previousSibling.previousSibling		
    amount.value++
  },

  // openMobileMenu() {
  //   document.querySelector('.menu-body-text').classList.remove('hide');
  //   document.querySelector('.menu-body-text').classList.add('menu-body-style');
  //   document.querySelector('.mobile-menu').classList.add('open-style');
  //   document.querySelector('.menu-button').classList.add('hide');
  //   document.querySelector('.menu-close').classList.remove('hide');
  //   document.querySelector('.background').classList.add('gray-1');
  //   document.querySelector('.mobile-filter-btn').addEventListener('click', this.openFilterBar);
	// },

	// openFilterBar() {
	// 	document.querySelector('.mobile-wrap').classList.remove('hide');
	// 	document.querySelector('.filter-btn').addEventListener('click', function() {
	// 		document.querySelector('.mobile-wrap').classList.add('hide');
	// 	})
	// },
	
	// closeMobileMenu() {
	// 	document.querySelector('.menu-body-text').classList.add('hide');
	// 	document.querySelector('.menu-body-text').classList.remove('menu-body-style');
	// 	document.querySelector('.mobile-menu').classList.remove('open-style');
	// 	document.querySelector('.menu-button').classList.remove('hide');
	// 	document.querySelector('.menu-close').classList.add('hide');
	// 	document.querySelector('.background').classList.remove('gray-1');
	// }
}

export default domUpdates;