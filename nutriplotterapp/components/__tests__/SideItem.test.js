import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import SideItem from '../SideItem.js';
import PopulateSideItems from '../../PopulateSideItems.js';
var r = new PopulateSideItems();

//first test to ensure working correctly
it('Test conditions working properly', async () => {
    const testVar = true;
    expect(true).toEqual(testVar);
});


it('SideItem: renders correctly', () => {
  const tree = renderer.create(<SideItem type={'fruit'} isDown={false} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('SideItem: should set passed values to state', () => {
  let sideItemComponent = renderer.create(<SideItem type={'fruit'} isDown={false} updateStateHome={0} />).getInstance()
  const targetState = {
  	isDown: false,
  	isPressed: false,
  	type: 'fruit',
  	refresh: 0,
  };
  expect(sideItemComponent.state).toEqual(targetState);
});

it('SideItem: isPressed function', () => {
  let sideItemComponent = renderer.create(<SideItem type={'fruit'} isDown={false} />).getInstance()
  sideItemComponent.sideItemPressed();
  const targetState = {
  	isDown: false,
  	isPressed: true,
  	type: 'fruit',
  	refresh: 0,
  };
  expect(sideItemComponent.state).toEqual(targetState);
});
