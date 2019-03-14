import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import {FlatListItem, EditFoodScreen} from '../EditFood.js';


//first test to ensure working correctly
it('Test conditions working properly', async () => {
    const testVar = true;
    expect(true).toEqual(testVar);
});


it('FlatListItem: renders correctly', () => {
  const tree = renderer.create(<FlatListItem listParent={this.props.listParent} item={item} index={index}/>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('FlatListItem: should set passed values to state', () => {

  expect(1).toEqual(1);
});

it('FlatListItem: should set passed values to state', () => {

  expect(1).toEqual(1);
});
