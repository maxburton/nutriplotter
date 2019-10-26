import 'react-native';
import React, { Component } from 'react'
import Plate from '../Plate';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import { SQLite } from 'expo-sqlite';
import * as WebBrowser from 'expo-web-browser';
import { shallow, mount } from 'enzyme';

const db = SQLite.openDatabase('db.db');

it('plate renders', () => {
    var plateComponent = renderer.create(<Plate />).toJSON();
    expect(plateComponent).toMatchSnapshot();
});
