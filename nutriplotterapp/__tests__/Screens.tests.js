import 'react-native';
import React from 'react';
//import App from '../App';
import Home from '../screens/HomeScreen';
import Leaderboard from '../screens/LeaderboardScreen';
import Links from '../screens/LinksScreen';
import Login from '../screens/LoginScreen';
import SavedPlates from '../screens/SavedPlatesScreen';
import Score from '../screens/ScoreScreen';
import Settings from '../screens/SettingsScreen';

import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';


describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  //Screens for Home, Score and Login emitted due to use of variables set on other pages that can't be found without running first

  it('renders Leaderboard screen as expected', async () => {
    const tree = renderer.create(<Leaderboard />).toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('renders links screen as expected', async () => {
    const tree = renderer.create(<Links />).toJSON();
    expect(tree).toMatchSnapshot();
  })


  it('renders SavedPlates screen as expected', async () => {
    const tree = renderer.create(<SavedPlates />).toJSON();
    expect(tree).toMatchSnapshot();
  })


  it('renders settings screen as expected', async () => {
    const tree = renderer.create(<Settings />).toJSON();
    expect(tree).toMatchSnapshot();
  })

});
