import { expect } from 'chai';

import Recipe from '../src/recipe';
import recipeData from '../src/data/recipe-data';
import ingredientsData from '../src/data/ingredient-data';

describe('Recipe', function() {
  let recipe;
  let recipeInfo;

  beforeEach(function() {
    recipeInfo = recipeData[0];
    recipe = new Recipe(recipeInfo);
  })

  it('is a function', function() {
    expect(Recipe).to.be.a('function');
  });

  it('should be an instance of Recipe', function() {
    expect(recipe).to.be.an.instanceof(Recipe);
	});
	
	it('if new Recipe instance is initialized without an argument, an error should throw', function() {
		expect(() => { const badRecipe = new Recipe() }).to.throw(Error);
	});

  it('should initialize with an id', function() {
    expect(recipe.id).to.eq(595736);
  });

  it('should initialize with an name', function() {
    expect(recipe.name).to.eq('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should initialize with an image', function() {
    expect(recipe.image).to.eq('https://spoonacular.com/recipeImages/595736-556x370.jpg');
  });

  it('should initialize with an array of ingredients', function() {
    const ingredient = {
      "id": 20081,
      "name": "all purpose flour",
      "quantity": {
        "amount": 1.5,
        "unit": "c"
      }
    }
    expect(recipe.ingredients[0]).to.deep.eq(ingredient);
	});
	
	it('should contain all instructions on initialization', function() {
		expect(recipe.instructions[0]).to.deep.eq({
      "instruction": "In a large mixing bowl, whisk together the dry ingredients (flour, pudding mix, soda and salt). Set aside.In a large mixing bowl of a stand mixer, cream butter for 30 seconds. Gradually add granulated sugar and brown sugar and cream until light and fluffy.",
      "number": 1
      });
	})

  it('should calculate the total cost of all of the ingredients', function() {
    expect(recipe.calculateIngredCost(ingredientsData)).to.eq(59.21);
	});
	
	it('if calculateIngredCost is invoked without an argument, an error will throw', function() {
    expect(() => { recipe.calculateIngredCost() }).to.throw(Error);
  });
});
