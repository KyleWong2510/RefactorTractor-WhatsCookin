const spies = require('chai-spies');
const chai = require('chai');
chai.use(spies);

import { expect } from 'chai';
import domUpdates from '../src/domUpdates';

describe('domUpdates', function() {
  let user;
  let pantry;
  let ingredientsData;

  beforeEach(function() {
    global.domUpdates = {};

    user = {
      "id": 1,
      "name": "Saig O'Kon",
      "pantry": [{
        "ingredient": 11477,
        "amount": 1
      },
      {
        "ingredient": 93820,
        "amount": 1
      }]
    };
    pantry = user.pantry;
    ingredientsData = [{
      "id": 20081,
      "name": "wheat flour",
      "estimatedCostInCents": 142
    },
    {
      "id": 18372,
      "name": "bicarbonate of soda",
      "estimatedCostInCents": 582
    }];
  });

  it('welcomeUser should display a welcome message', () => {
    chai.spy.on(domUpdates, ['welcomeUser'], () => {});

    domUpdates.welcomeUser(user, pantry, ingredientsData);

    expect(domUpdates.welcomeUser).to.have.been.called(1);
    expect(domUpdates.welcomeUser).to.have.been.called.with(user, pantry, ingredientsData);
  });

  it('displayRecipeCards should a recipe card', () => {
    const currentRecipe = {
      "name": "Loaded Chocolate Chip Pudding Cookie Cups",
      "id": 595736,
      "image": "https://spoonacular.com/recipeImages/595736-556x370.jpg",
      "ingredients": [
        {
          "name": "all purpose flour",
          "id": 20081,
          "quantity": {
            "amount": 1.5,
            "unit": "c"
          }
        }]
    };
    const shortRecipeName = currentRecipe.name;
    chai.spy.on(domUpdates, ['displayRecipeCards'], () => {});

    domUpdates.displayRecipeCards(currentRecipe, shortRecipeName);

    expect(domUpdates.displayRecipeCards).to.have.been.called(1);
    expect(domUpdates.displayRecipeCards).to.have.been.called.with(currentRecipe, shortRecipeName);
	});
})
