class Pantry {
  constructor(givenUser) {
    this.data = givenUser.pantry;
  }

  checkPantry(clickedRecipe, dataset1, dataset2) {
    const foundRecipe = dataset1.find(recipe => {
      return recipe.id === clickedRecipe.id;
    })

    let ownedIngreds = []
    foundRecipe.ingredients.forEach(ingred => {
      this.data.forEach(i => {
        if (i.ingredient === ingred.id) {
					ownedIngreds.push(ingred.id);
				}
      })
    })

    const parsedNames = ownedIngreds.map(i => dataset2.find(ingred => ingred.id === i).name);
		return [... new Set(parsedNames)];
	}

  findIngredsMissing(clickedRecipe, dataset1, dataset2) {
		const ownedIngreds = this.checkPantry(clickedRecipe, dataset1, dataset2)
		const ownedIngredIDs = ownedIngreds.map(i => dataset2.find(ingred => ingred.name === i).id);
    const foundRecipe = dataset1.find(recipe => recipe.id === clickedRecipe.id)

		let missingIngreds = [];
    foundRecipe.ingredients.forEach(i => {
      if (!ownedIngredIDs.includes(i.id)) missingIngreds.push(i.id);
    })

    const parsedNames = missingIngreds.map(i => dataset2.find(ingred => ingred.id === i).name);
		return [... new Set(parsedNames)];
	}
}

module.exports = Pantry;
