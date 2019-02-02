import React from "react";
import { createSwitchNavigator, createStackNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import EditFoodScreen from "../screens/EditFoodScreen";

const plateNav = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen
  },
  EditFoodScreen: {
    screen: EditFoodScreen
  },
});

const loginNav = createStackNavigator({
  LoginScreen: {
	screen: LoginScreen
  }
});

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  HomeScreen: plateNav,
  LoginScreen: loginNav,
});
