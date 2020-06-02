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
    if(!Object.keys(recipe).includes('id') || !Object.keys(recipe).includes('name') || !Object.keys(recipe).includes('ingredients') || !Object.keys(recipe).includes('instructions') || !Object.keys(recipe).includes('tags') || !Object.keys(recipe).includes('image')) {
      return 'You must pass a valid recipe'
    }
    if(array === 'favoriteRecipes' || array === 'recipesToCook') {
      this[array].push(recipe)
    } else return 'You must pass a valid array'
  }

  removeRecipe(recipe, array) {
    if(!Object.keys(recipe).includes('id') || !Object.keys(recipe).includes('name') || !Object.keys(recipe).includes('ingredients') || !Object.keys(recipe).includes('instructions') || !Object.keys(recipe).includes('tags') || !Object.keys(recipe).includes('image')) {
      return 'You must pass a valid recipe'
    }
    if(array === 'favoriteRecipes' || array === 'recipesToCook') {
      let i = this[array].indexOf(recipe);
      this[array].splice(i, 1);
    } else return 'You must pass a valid array'
  }
  
  //does not get called
  // filterRecipes(tag, array) {
  //   if(typeof tag !== 'string') return 'You must pass a valid tag that is a string'
  //   if(array === 'favoriteRecipes' || array === 'recipesToCook') {
  //     return this[array].filter(recipe => recipe.tags.includes(tag));
  //   } else return 'You must pass a valid array'
	// }
	
  searchForRecipe(keyword, array) {
    // if(typeof keyword !== 'string') return 'You must pass a valid keyword that is a string'
    // if(array === 'favoriteRecipes' || array === 'recipesToCook') {
      let byName = this.searchByName(keyword, array)
      let byIngredient = this.searchByIngred(keyword, array)
      let searchedResults = byName.concat(byIngredient)
      return [... new Set(searchedResults)]
    // } else return 'You must pass a valid array'
  }

  searchByName(keyword, array) {
    console.log('keyword', keyword)
    const searchedResults = []
    array.forEach(recipe => {
      if (recipe.name.toLowerCase().includes(keyword.toLowerCase())) {
        searchedResults.push(recipe)
      }
    })
    return searchedResults
  }

  searchByIngred(keyword, array) {
    const searchedResults = [];
    let ingredientIDs = [];

    if(keyword === 'salt' || keyword === 'pepper') {
      ingredientIDs = ingredientsData
        .filter(ingred => ingred.name)
        .filter(ingred => {
          return ingred.name.toLowerCase().includes(keyword.toLowerCase()) || 
          ingred.name.toLowerCase().includes('s&p')
        })
        .map(ingred => ingred.id)
    } else {
      ingredientIDs = ingredientsData
        .filter(ingred => ingred.name)
        .filter(ingred => ingred.name.toLowerCase().includes(keyword.toLowerCase()))
        .map(ingred => ingred.id)
    }
    
    array.forEach(recipe => {
      recipe.ingredients.forEach(ingred => {
        if (ingredientIDs.includes(ingred.id)) {
          searchedResults.push(recipe)
        }
      })  
    })
    return [... new Set(searchedResults)]
  }

}

export default User;
