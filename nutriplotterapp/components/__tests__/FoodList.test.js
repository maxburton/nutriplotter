import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import List from '../FoodList.js';
import popArray from '../../populateArray.js';
import popNameList from '../../populateNameList.js';
global.favourites = [];
//var r = new popNameList();
//var p = new popArray();

//first test to ensure working correctly
it('Test conditions working properly', async () => {
    const testVar = true;
    expect(true).toEqual(testVar);
});
//2 components in this filename, only List exported


//tests for list
it('List: renders correctly', () => {
  const tree = renderer.create(<List />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('List: State init ', () => {
  let ListComponent = renderer.create(<List />).getInstance();
  const targetState = {
    name: '',
    test: 'Recently Searched:',
    names: [],
    refresh: 0,
  };
  expect(ListComponent.state).toEqual(targetState);
});
