class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.pantry = user.pantry;
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }

  saveRecipe(recipe, array) {
    this[array].push(recipe);
  }

  removeRecipe(recipe, array) {
    let i = this[array].indexOf(recipe);
    this[array].splice(i, 1);
  }
	
  filterRecipes(tag, array) {
    return this[array].filter(recipe => recipe.tags.includes(tag));
	}
	
  searchForRecipe(keyword, array) {
    let searchedResults = []
    array.forEach(recipe => {
      if(recipe.name.includes(keyword)) {
        searchedResults.push(recipe)
      }
      recipe.ingredients.forEach(ingred => {
        if(ingred.name.includes(keyword)) {
          searchedResults.push(recipe)
        }
      })
    })
    let unique = [... new Set(searchedResults)]
    return unique
  }
}

export default User;
