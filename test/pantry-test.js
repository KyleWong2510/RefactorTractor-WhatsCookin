import { expect } from 'chai';

import User from '../src/user';
import Pantry from '../src/pantry';
import users from '../src/data/users-data';
import recipeData from '../src/data/recipe-data';

describe('Pantry', function() {
  let user;
	let userInfo;
	let pantry;

  beforeEach(function() {
    userInfo = users[1];
		user = new User(userInfo);
		pantry = new Pantry(user);
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
});