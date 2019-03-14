import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Plate from '../Plate.js';


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

//still to test
//componentDidMount, state change to loaded:true

//platePressed modal visibility

//closeModel opposite of above, maybe combine and double assert

//renderPieSeries, returns state values, ez pz

//clearFoodState, edits state values

//getFoodNames, returns string. maybe hard to work out but possible

//not sure if this is place to do testing on scores or not

//if this is where scores calc'd, handle component linking here too
