/*
	Populates a local JSON array with every food and their nutritional info
*/

import React from 'react';
import { Platform} from 'react-native';

export default class PopulateSideItems extends React.Component {
	constructor(){
		super();


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
		"omega3": 0.02,
		"calcium": 0,
		"vitA": 0.03,
		"vitB1": 0.03,
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
		"omega3": 0.10,
		"calcium": 28,
		"vitA": 49.00,
		"vitB1": 0.06,
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
		"omega3": 0.82,
		"calcium": 0,
		"vitA": 0.00,
		"vitB1": 0.25,
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
		"vitB1": 0.00,
		"vitB9": 0,
		"vitC": 0
	}}]
	
	}
}