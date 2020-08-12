/*
	Populates a local JSON array with every side item and their nutritional info
*/

import React from 'react';

var Datastore = require('react-native-local-mongodb'),
db = new Datastore({ filename: 'foods', autoload: true });

export default class PopulateSideItems extends React.Component {
	constructor() {
		super();

		// fruit is apple, based on McCance's [Apples, eating, raw, flesh and skin, weighed with core] with a weight of 182g (medium apple weight)
		// dairy is yoghurt, based on McCance's [Yogurt, whole milk, plain] with a weight of 150g
		// bread is white bread, based on McCance's [Bread, white, sliced] with a weight of 38g
		// drink is cola, based on McCance's [Cola] with a weight of 344g (330ml can)

		// use this and a weight multiplier to get nutritional info for items, perhaps include option to insert custom foods not in mccance (in this file manually)
		sideItemFoods = ["apples, eating, raw, flesh and skin, weighed with core", "yogurt, whole milk, plain", "bread, white, sliced", "cola"];
		sideItemWeights = [182, 150, 38, 344];
		sideItemTypes = ["fruit", "dairy", "bread", "drink"];

		global.sideItems = [];

		console.log("Populating Side Items DB...");
		for (let i = 0; i < sideItemFoods.length; i++) {
			db.find({ _id: sideItemFoods[i] }, function (err, foodItem) {
				if (err) {
					throw err;
				}
				if (foodItem.length == 0) {
					throw Error("[populateSideItems.js] This food doesn't exist in the mongoDB!");
				}else{
					// Get map from array
					foodItem = foodItem[0];
					
					// remove metadata
					delete foodItem["_id"];
					delete foodItem["group"];

					// get nutrients according to their weight
					let multiplier = sideItemWeights[i] / 100;
					for (key in foodItem) {
						foodItem[key] = foodItem[key] * multiplier;
					}
					
					// add item to global array
					global.sideItems.push({
						"_id": i + 1,
						"type": sideItemTypes[i],
						"isIn": false,
						"nutrition": foodItem
					});
				}

			});

		}

		/*
		global.sideItems =	
		[{
		"_id":1,
		"type":"fruit",
		"isIn":false,
		"nutrition": {
			"calories": 95,
			"carbs": 25,
			"fats": 0.3,
			"protein": 0.5,
			"sugar": 19,
			"satfat": 0.1,
			"fibre": 4.4,
			"omega3": 20,
			"calcium": 0,
			"vitA": 0.03,
			"vitB1": 30,
			"vitB9": 0,
			"vitC": 8.4
		}},
		{
		"_id":2,
		"type":"dairy",
		"isIn":false,
		"nutrition": {
			"calories": 79,
			"carbs": 7.8,
			"fats": 3.0,
			"protein": 5.7,
			"sugar": 7.8,
			"satfat": 1.91,
			"fibre": 0.00,
			"omega3": 10,
			"calcium": 28,
			"vitA": 49.00,
			"vitB1": 60,
			"vitB9": 18,
			"vitC": 1
		}},
		{
		"_id":3,
		"type":"bread",
		"isIn":false,
		"nutrition": {
			"calories": 217,
			"carbs": 42.0,
			"fats": 2.5,
			"protein": 9.4,
			"sugar": 2.8,
			"satfat": 0.46,
			"fibre": 12.00,
			"omega3": 820,
			"calcium": 0,
			"vitA": 0.00,
			"vitB1": 250,
			"vitB9": 40,
			"vitC": 0
		}},
		{
		"_id":4,
		"type":"drink",
		"isIn":false,
		"nutrition": {
			"calories": 41,
			"carbs": 10.9,
			"fats": 0.0,
			"protein": 0,
			"sugar": 10.9,
			"satfat": 0.00,
			"fibre": 0.00,
			"omega3": 0.00,
			"calcium": 0,
			"vitA": 0.00,
			"vitB1": 0,
			"vitB9": 0,
			"vitC": 0
		}}]
		*/

	}
}