/*
	Determines which screens can navigate to which other screens
*/

import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack'

import MainTabNavigator from "./MainTabNavigator";

//import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
//import LinksScreen from "../screens/LinksScreen";
import LoginScreen from "../screens/LoginScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import ScoreScreen from "../screens/ScoreScreen";

const plateNav = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen
  },
  ScoreScreen: {
    screen: ScoreScreen
  }
});

const loginNav = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen
  },
  LeaderboardScreen: {
    screen: LeaderboardScreen
  }
});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    HomeScreen: plateNav,
    LoginScreen: loginNav
  }));
