/*
  Determines which screens the bottom tab navigator can navigate to.
  Due to how navigation, tab menus and screens are managed in react native, each screen is individually held
  within its own StackNavigator, each of which are held within the TabNavigator.

                TabNavigator
                      |
       |-----------|------------|------------------|---------------|
       HomeStack   LinksStack   SavedPlatesStack   SettingsStack   LoginStack

  Where the user is routed to HomeStack on app startup.

*/

import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SavedPlatesScreen from "../screens/SavedPlatesScreen";

const HomeStack = createStackNavigator({
  Home: HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: "Plate",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      // Give the appropriate icon for the platform
      name={Platform.OS === "ios" ? "ios-disc" : "md-radio-button-on"}
    />
  )
};

const LinksStack = createStackNavigator({
  Links: LinksScreen
});

LinksStack.navigationOptions = {
  tabBarLabel: "Help",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-settings" : "md-settings"}  
    />
  )
};

const SavedPlatesStack = createStackNavigator({
  SavedPlates: SavedPlatesScreen
});

SavedPlatesStack.navigationOptions = {
  tabBarLabel: "Saved Plates",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-pie" : "md-pie"}
    />
  )
};

const LoginStack = createStackNavigator({
  Login: LoginScreen
});

LoginStack.navigationOptions = {
  tabBarLabel: "Login",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-person" : "md-person"}
    />
  )
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SavedPlatesStack,
  SettingsStack,
  LoginStack
});
