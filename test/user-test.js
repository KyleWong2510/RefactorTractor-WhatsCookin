import { expect } from 'chai';

import User from '../src/user';
import users from '../src/data/users-data';
import recipeData from '../src/data/recipe-data';

describe('User', function() {
  let user;
  let userInfo;
  let recipe1, recipe2, recipe3;

  beforeEach(function() {
    userInfo = users[0];
    user = new User(userInfo)

    recipe1 = recipeData[0];
    recipe2 = recipeData[1];
    recipe3 = recipeData[2]
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should initialize with an id', function() {
    expect(user.id).to.eq(1);
  });

  it('should initialize with a name', function() {
    expect(user.name).to.eq('Saige O\'Kon');
  });

  it('should initialize with a pantry', function() {
    expect(user.pantry[0].ingredient).to.eq(11477);
  });

  it('should initialize with an empty favoriteRecipes array', function() {
    expect(user.favoriteRecipes).to.deep.equal([]);
  });

  it('should initialize with an empty recipesToCook array', function() {
    expect(user.recipesToCook).to.deep.equal([]);
  });

  it('should be able to save a recipe to favoriteRecipes', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    // console.log(recipe1)
    // console.log(user.favoriteRecipes)
    expect(user.favoriteRecipes[0].name).to.equal('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should be able to decide to cook a recipe', function() {
    user.saveRecipe(recipe2, 'recipesToCook');
    expect(user.recipesToCook[0].name).to.equal('Maple Dijon Apple Cider Grilled Pork Chops');
  });

  it('should notify user if the array entered is not on the user object', function() {
    expect(user.saveRecipe(recipe1, 'myFavorites')).to.equal('You must pass a valid array');
  });

  it('should notify user if the recipe object is not in the right format', function() {
    let recipe4 = {
      id: 3,
      name: 'foods',
      ingredients: []
    }
    expect(user.saveRecipe(recipe4, 'favoriteRecipes')).to.equal('You must pass a valid recipe');
  });

  it('should be able to remove a recipe from a given array', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes')
    user.saveRecipe(recipe2, 'favoriteRecipes')
    user.saveRecipe(recipe3, 'favoriteRecipes')
    user.removeRecipe(recipe2, 'favoriteRecipes');
    expect(user.favoriteRecipes).to.deep.equal([recipe1, recipe3]);
  });

  it('should be able to filter recipes by type', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    user.saveRecipe(recipe2, 'favoriteRecipes');
    user.saveRecipe(recipe3, 'favoriteRecipes');
    expect(user.filterRecipes('snack', 'favoriteRecipes')).to.deep.equal([recipe1]);
  });

  it('should only accept a string as a tag to search for', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    expect(user.filterRecipes(3, 'favoriteRecipes')).to.equal('You must pass a valid tag that is a string');
  })

  it('should be able to search recipes by name', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    user.saveRecipe(recipe2, 'favoriteRecipes')
    expect(user.searchForRecipe('Loaded', 'favoriteRecipes')).to.deep.equal([recipe1]);
  });

  it('should be able to search recipes by ingredient', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    user.saveRecipe(recipe2, 'favoriteRecipes');
    user.saveRecipe(recipe3, 'favoriteRecipes');

    expect(user.searchForRecipe('pepper', 'favoriteRecipes')).to.deep.equal([recipe2, recipe3]);
  });

  it('should only accept a string as a keyword', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    user.saveRecipe(recipe2, 'favoriteRecipes');
    user.saveRecipe(recipe3, 'favoriteRecipes');

    expect(user.searchForRecipe([], 'favoriteRecipes')).to.equal('You must pass a valid keyword that is a string');
  });

  it('should only accept a valid array', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    user.saveRecipe(recipe2, 'favoriteRecipes');
    user.saveRecipe(recipe3, 'favoriteRecipes');

    expect(user.searchForRecipe('pepper', 'myFavorites')).to.equal('You must pass a valid array');
  });
});
