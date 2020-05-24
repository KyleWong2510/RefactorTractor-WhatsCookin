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
});