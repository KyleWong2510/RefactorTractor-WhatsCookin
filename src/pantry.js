class Pantry {
  constructor(givenUser) {
    this.data = givenUser.pantry;
  }

  checkPantry(clickedRecipe, ingredientData) {
    let ownedIngreds = []
    clickedRecipe.ingredients.forEach(ingred => {
      this.data.forEach(i => {
        if (i.ingredient === ingred.id) ownedIngreds.push(ingred.id);
      })
    })

    const parsedNames = ownedIngreds.map(i => ingredientData.find(ingred => ingred.id === i).name);
		return [... new Set(parsedNames)];
	}

  findIngredsMissing(clickedRecipe, ingredientData) {
		const ownedIngreds = this.checkPantry(clickedRecipe, ingredientData);
		const ownedIngredIDs = ownedIngreds.map(i => ingredientData.find(ingred => ingred.name === i).id);

		let missingIngreds = [];
    clickedRecipe.ingredients.forEach(i => {
      if (!ownedIngredIDs.includes(i.id)) missingIngreds.push(i.id);
    })

    const parsedNames = missingIngreds.map(i => ingredientData.find(ingred => ingred.id === i).name);
		return [... new Set(parsedNames)];
	}
}

module.exports = Pantry;
