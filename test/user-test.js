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
    expect(user.favoriteRecipes[0].name).to.equal('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should be able to decide to cook a recipe', function() {
    user.saveRecipe(recipe2, 'recipesToCook');
    expect(user.recipesToCook[0].name).to.equal('Maple Dijon Apple Cider Grilled Pork Chops');
  });

  it('should be able to remove a recipe from favorites', function() {
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

  it('should be able to search recipes by name', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    user.saveRecipe(recipe2, 'favoriteRecipes')
    expect(user.searchForRecipe('Loaded', user.favoriteRecipes)).to.deep.equal([recipe1]);
  });

  it('should be able to search recipes by ingredient', function() {
    user.saveRecipe(recipe1, 'favoriteRecipes');
    user.saveRecipe(recipe2, 'favoriteRecipes');
    user.saveRecipe(recipe3, 'favoriteRecipes');

    expect(user.searchForRecipe('pepper', user.favoriteRecipes)).to.deep.equal([recipe2, recipe3]);
  });
});
