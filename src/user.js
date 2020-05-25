import ingredientsData from '../src/data/ingredient-data';

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
    let byName = this.searchByName(keyword, array)
    let byIngredient = this.searchByIngred(keyword, array)
    let searchedResults = byName.concat(byIngredient)
    return [... new Set(searchedResults)]
  }

  searchByName(keyword, array) {
    let searchedResults = []
    array.forEach(recipe => {
      if(recipe.name.toLowerCase().includes(keyword)) {
        searchedResults.push(recipe)
      }
    })
    return searchedResults
  }
//s&p issue
  searchByIngred(keyword, array) {
    let searchedResults = []
    let ingredientIDs = ingredientsData
      .filter(ingred => ingred.name)
      .filter(ingred => ingred.name.toLowerCase().includes(keyword))
      .map(ingred => ingred.id)
    
      array.forEach(recipe => {
      recipe.ingredients.forEach(ingred => {
        if(ingredientIDs.includes(ingred.id)) {
          searchedResults.push(recipe)
        }
      })  
    })
    console.log('ingred', searchedResults)
    return [... new Set(searchedResults)]
  }

}

export default User;
