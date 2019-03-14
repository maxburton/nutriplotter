import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import {List, FlatListItem} from '../FoodList.js';



//first test to ensure working correctly
it('Test conditions working properly', async () => {
    const testVar = true;
    expect(true).toEqual(testVar);
});

//2 components in this filename

//need to get inputs to this somehow

//start with FlatListItem
it('FlatListItem: renders correctly', () => {
  const tree = renderer.create(<FlatListItem listParent={this.props.listParent} item={item} index={index}/>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('FlatListItem: check state init: !isPlateIn', () => {
  let FlatListItemComponent = renderer.create(<FlatListItem listParent={this.props.listParent} item={item} index={index}/>).getInstance()
  const targetState = {
    isSelected:true
  };
  expect(FlatListItemComponent.state).toEqual(targetState);
});

it('FlatListItem: check state init: isPlateIn', () => {
  let FlatListItemComponent = renderer.create(<FlatListItem listParent={this.props.listParent} item={item} index={index}/>).getInstance()
  const targetState = {
    isSelected:false
  };
  expect(FlatListItemComponent.state).toEqual(targetState);
});
//don't understant any of the other functions


//tests for list
it('List: renders correctly', () => {
  const tree = renderer.create(<List />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('List: State init ', () => {
  let ListComponent = renderer.create(<List />).toJSON();
  const targetState = {
    //no clue
  };
  expect(ListComponent.state).toEqual(targetState);
});

it('List: test determineGroup ', () => {
  let ListComponent = renderer.create(<List />).toJSON();
  let returnVal = ListComponent.determineGroup("aa");
  expect(returnVal).toEqual("grains");
});
