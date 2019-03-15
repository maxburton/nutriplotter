import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import EditFoodScreen from '../EditFood.js';
import popArray from "../../populateArray";
import popList from "../../populateNameList";

var p = new popArray();
var q = new popList();
global.plate = [];

//first test to ensure working correctly
it('Test conditions working properly', async () => {
    const testVar = true;
    expect(true).toEqual(testVar);
});

//test screen renders correctly
it('EditFoodScreen: renders correctly', () => {
  const tree = renderer.create(<EditFoodScreen/>).toJSON();
  expect(tree).toMatchSnapshot();
});

//test screen gets init state values
it('EditFoodScreen: should set passed values to state', () => {
  let FoodScreen = renderer.create(<EditFoodScreen/>).getInstance();
  const targetState = {
  		empty:'Your plate is empty! Add some by searching on the plate screen.',
  		foods:[],
  		refresh: 0,
  	}
  expect(FoodScreen.state).toEqual(targetState);
});
