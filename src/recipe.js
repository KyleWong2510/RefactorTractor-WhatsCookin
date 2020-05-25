class Recipe {
  constructor(recipe) {
    this.name = recipe.name;
    this.id = recipe.id;
    this.image = recipe.image;
    this.ingredients = recipe.ingredients;
		this.tags = recipe.tags;
		this.instructions = recipe.instructions;
	}
	
  calculateIngredCost(dataset) {
		const totalCost = this.ingredients.reduce((acc, ingred) => {
			const itemCost = dataset.find(i => i.id === ingred.id).estimatedCostInCents;
			acc += itemCost;

			return acc
		}, 0) / 100;
		return totalCost;
	}
}

module.exports = Recipe;
