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
    chai.spy.on(domUpdates, ['welcomeUser', 'displayPantryInfo'], () => {})

    domUpdates.welcomeUser(user, pantry, ingredientsData);

    expect(domUpdates.welcomeUser).to.have.been.called(1);
    expect(domUpdates.welcomeUser).to.have.been.called.with(user, pantry, ingredientsData);
		expect(domUpdates.displayPantryInfo).to.have.been.called(1);
	});
})
