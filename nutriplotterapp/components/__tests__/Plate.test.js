import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Plate from '../Plate.js';
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

it('Plate: renders correctly', () => {
  const tree = renderer.create(<Plate />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Plate: should set passed values to state', () => {
  let sideItemComponent = renderer.create(<Plate />).getInstance()
  const targetState = {
      foods: [], // Of Food Component
      pieSeries: [],
      pieColours: [],
      empty: true,
      isLoaded: false,
      refresh: 0,
      isModalVisible: false
    };
  expect(sideItemComponent.state).toEqual(targetState);
});
