/*
	Populates a local JSON array with default saved plates and their nutritional info
*/

import React from 'react';
import { Platform} from 'react-native';

export default class PopulateSavedPlates extends React.Component {
	constructor(){
		super();


	global.savedPlates =	
	[
	{"plateName": "Spaghetti Bolognese",
	"score": 2904,
	"sideItems": [{
    "_id": 1,
    "isIn": true,
    "nutrition": {
      "calcium": 0,
      "calories": 95,
      "carbs": 25,
      "fats": 0.3,
      "fibre": 4.4,
      "omega3": 0.02,
      "protein": 0.5,
      "satfat": 0.1,
      "sugar": 19,
      "vitA": 0.03,
      "vitB1": 0.03,
      "vitB9": 0,
      "vitC": 8.4,
    },
    "type": "fruit",
  },
  {
    "_id": 2,
    "isIn": false,
    "nutrition": {
      "calcium": 28,
      "calories": 79,
      "carbs": 7.8,
      "fats": 3,
      "fibre": 0,
      "omega3": 0.1,
      "protein": 5.7,
      "satfat": 1.91,
      "sugar": 7.8,
      "vitA": 49,
      "vitB1": 0.06,
      "vitB9": 18,
      "vitC": 1,
    },
    "type": "dairy",
  },
  {
    "_id": 3,
    "isIn": false,
    "nutrition": {
      "calcium": 0,
      "calories": 217,
      "carbs": 42,
      "fats": 2.5,
      "fibre": 12,
      "omega3": 0.82,
      "protein": 9.4,
      "satfat": 0.46,
      "sugar": 2.8,
      "vitA": 0,
      "vitB1": 0.25,
      "vitB9": 40,
      "vitC": 0,
    },
    "type": "bread",
  },
  {
    "_id": 4,
    "isIn": true,
    "nutrition": {
      "calcium": 0,
      "calories": 41,
      "carbs": 10.9,
      "fats": 0,
      "fibre": 0,
      "omega3": 0,
      "protein": 0,
      "satfat": 0,
      "sugar": 10.9,
      "vitA": 0,
      "vitB1": 0,
      "vitB9": 0,
      "vitC": 0,
    },
    "type": "drink",
  },
],
	"plate": [
	{
    "_id": "Pasta, white, spaghetti, dried, boiled in unsalted water",
    "amount": 50,
    "data": {
      "calcium": 0,
      "calories": 141,
      "carbs": 31.5,
      "fats": 0.6,
      "fibre": 3.2,
      "group": "ad",
      "name": "pasta, white, spaghetti, dried, boiled in unsalted water",
      "omega3": 0.25,
      "protein": 4.4,
      "satfat": 0.09,
      "sugar": 1,
      "vitA": 0,
      "vitB1": 0.08,
      "vitB9": 8,
      "vitC": 0,
    },
    "group": "pasta",
  },
  {
    "_id": "Bolognese sauce (with meat), homemade",
    "amount": 35,
    "data": {
      "calcium": 0,
      "calories": 161,
      "carbs": 2.8,
      "fats": 11.6,
      "fibre": 1.3,
      "group": "mr",
      "name": "bolognese sauce (with meat), homemade",
      "omega3": 1.86,
      "protein": 11.8,
      "satfat": 4.2,
      "sugar": 2.6,
      "vitA": 694,
      "vitB1": 0.09,
      "vitB9": 7,
      "vitC": 3,
    },
    "group": "beef",
  },
  {
    "_id": "Sauce, pasta, tomato based, for bolognese",
    "amount": 10,
    "data": {
      "calcium": 0,
      "calories": 44,
      "carbs": 6.9,
      "fats": 1.3,
      "fibre": 3.3,
      "group": "wc",
      "name": "sauce, pasta, tomato based, for bolognese",
      "omega3": 0.35,
      "protein": 1.5,
      "satfat": 0.21,
      "sugar": 6.1,
      "vitA": 577,
      "vitB1": 0.06,
      "vitB9": 2,
      "vitC": 0,
    },
    "group": "sauce",
  },
  {
    "_id": "Parsley, fresh",
    "amount": 0,
    "data": {
      "calcium": 0,
      "calories": 34,
      "carbs": 2.7,
      "fats": 1.3,
      "fibre": 5,
      "group": "h",
      "name": "parsley, fresh",
      "omega3": 0,
      "protein": 3,
      "satfat": 0,
      "sugar": 2.3,
      "vitA": 4040,
      "vitB1": 0.23,
      "vitB9": 170,
      "vitC": 190,
    },
    "group": "herbs",
  }
  ]}
  ]
	
	
	}
}