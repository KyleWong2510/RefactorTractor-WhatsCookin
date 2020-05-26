class Pantry {
	constructor(givenUser) {
		this.data = givenUser.pantry;
	}

	checkPantry(checkedIngreds, dataset1, dataset2) {
		const allRecipeI = [];

		const ingredID = checkedIngreds.map(ingred => {
			return dataset2.find(i => i.name === ingred).id
		})

		ingredID.forEach(ingred => {
			dataset1.forEach(recipe => {
				recipe.ingredients.forEach(ingredient => {
					if (ingredient.id === ingred)
						allRecipeI.push(recipe)
				})
			})
		})
	
		return allRecipeI;
	}
}

module.exports = Pantry;
