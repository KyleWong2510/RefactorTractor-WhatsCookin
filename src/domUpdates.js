let domUpdates = {
	welcomeUser(user, pantry, ingredientsData) {
		let firstName = user.name.split(" ")[0];
    let welcomeMsg = `
		<div class="welcome-msg">
		<h1>Welcome ${firstName}!</h1>
		</div>`;
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
		welcomeMsg);
		
		this.displayPantryInfo(pantry.data.sort((a, b) => a.name - b.name), ingredientsData);
	},

	displayPantryInfo(pantry, ingredientsData) {
		pantry.forEach(ingredient => {
			const ingredName = ingredientsData.find(ingred => ingred.id === ingredient.ingredient).name;

			const ingredientHtml = `<li>${ingredName}, ${ingredient.amount}</li>`;
			document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
				ingredientHtml);
		});
	},

	displayRecipeCards(currentRecipe, shortRecipeName) {
		let main = document.querySelector("main");
		let tagsToList = currentRecipe.tags.map(tag => `<h4>${tag}</h4>`);

		let cardHtml = `
    <div class="recipe-card" id=${currentRecipe.id}>
      <h3 maxlength="40">${shortRecipeName}</h3>
      <div class="card-photo-container">
        <img src=${currentRecipe.image} class="card-photo-preview" alt="${currentRecipe.name} recipe" title="${currentRecipe.name} recipe">
        <div class="text">
          <div>Click for Instructions</div>
        </div>
			</div>
      <div>${tagsToList}</div>
      <div class="button-holder">
      <img src="../images/recipegreen.png" class="recipe-icon-card" alt="recipes to cook icon"/>
      <img src="../images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>
    </div>`
  	main.insertAdjacentHTML("beforeend", cardHtml);
	},

	listTags(allTags) {
		let tagList = document.querySelector(".tag-list");
		allTags.forEach(tag => {
			let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
				<label for="${tag}">${this.capitalize(tag)}</label></li>`;
			tagList.insertAdjacentHTML("beforeend", tagHtml);
		})
	},

	capitalize(words) {
		return words.split(" ").map(word => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}).join(" ");
	},
	//Changes as of 5/28
	filterRecipesOnPage(allRecipes, user) {
		if (document.querySelector('.welcome-msg').style.display !== 'none') {
			this.findCheckedBoxes(allRecipes)
		}
		if (document.querySelector(".my-recipes-banner").style.display !== 'none') {
			this.findCheckedBoxes(user.favoriteRecipes)
		}
		//if banner is cooknext then
		// findCheckedBoxes(user.recipesToCook)
	},

	//not really dom updates...how can this live in scripts?
	findCheckedBoxes(arr) {
		let tagCheckboxes = document.querySelectorAll(".checked-tag");
		let checkboxInfo = Array.from(tagCheckboxes)
		let selectedTags = checkboxInfo.filter(box => {
			return box.checked;
		})
		this.findTaggedRecipes(selectedTags, arr);
	},

	findTaggedRecipes(selected, arr) {
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
		this.showFilteredRecipes(arr)
		if (filteredResults.length > 0) {
			this.filterRecipes(filteredResults, arr);
		}
	},
	// Too many params
	showFilteredRecipes(arr, allRecipes, recipeData, user) {
		this.showAllRecipes()
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
			}
			// } else {
			//show toDoList banner
		}
	},

	showMyRecipesBanner() {
		document.querySelector('.to-cook-banner').style.display = 'none';
		document.querySelector(".welcome-msg").style.display = "none";
		document.querySelector(".my-recipes-banner").style.display = "block";
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
	}
	
	

}

export default domUpdates;