import { expect } from 'chai';

import User from '../src/user';
import Pantry from '../src/pantry';
import users from '../src/data/users-data';
import recipeData from '../src/data/recipe-data';
import ingredientsData from '../src/data/ingredient-data';

describe('Pantry', function() {
  let user;
	let userInfo;
	let pantry;
	let recipe;
	let recipe2;

  beforeEach(function() {
    userInfo = users[1];
		user = new User(userInfo);
		pantry = new Pantry(user);
		recipe = recipeData[0];
		recipe2 = recipeData[11];
  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should initialize with user\'s accurate pantry amount of 478 items', function() {
		expect(pantry.data.length).to.equal(478);
		expect(pantry.data[0]).to.deep.equal({ ingredient: 6150, amount: 5 });
	});

	it('if new Pantry instance is initialized without an argument, an error should throw', function() {
		expect(() => { const badPantry = new Pantry() }).to.throw(Error);
	});
	
	it('on initialization, user\'s first item should be ingredient #6150 wih a quantity of 5', function() {
		expect(pantry.data[0]).to.deep.equal({ ingredient: 6150, amount: 5 });
	});
	
	it('checkPantry should return the owned items for a given recipe', function() {
		const ownedItems = pantry.checkPantry(recipe, recipeData, ingredientsData);

		expect(ownedItems).to.deep.equal([
			"wheat flour", "bicarbonate of soda", 
			"eggs", "sucrose", "instant vanilla pudding", 
			"brown sugar", "salt", "fine sea salt", 
			"semi sweet chips", "unsalted butter", "vanilla"
    ]);
	});

	it('if checkPantry method is invoked without an argument, an error should throw', function() {
		expect(() => { pantry.checkPantry(recipeData, ingredientsData) }).to.throw(Error);
	});

	it('findIngredsMissing should return the ingredients the user does not have for a given recipe', function() {
		const missingItems = pantry.findIngredsMissing(recipe2, recipeData, ingredientsData);

		expect(missingItems).to.deep.equal([
			"graham cracker crust", "ground cinnamon", 
			"powdered ginger", "low fat cream cheese", 
			"whole grain rolled oats"
    ]);
	});

	it('if findIngredsMissing method is invoked without an argument, an error should throw', function() {
		expect(() => { pantry.findIngredsMissing(recipeData, ingredientsData) }).to.throw(Error);
	});
});