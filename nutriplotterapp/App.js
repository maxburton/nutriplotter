import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import { AppLoading, Asset, Font, Icon, SQLite } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import popDB from "./populateDatabase";
import firebase from "./components/Firebase.js";

const db = SQLite.openDatabase("db.db");
//const isFirstLaunch = SQLite.openDatabase('ifl.db');

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  submitToDB = async (
    name,
    calories,
    carbs,
    fats,
    protein,
    sugar,
    satfat,
    fibre,
    omega3,
    group,
    calcium,
    vitA,
    vitB1,
    vitB9,
    vitC
  ) => {
    firebase
      .database()
      .ref("foods/" + name)
      .set({
        calories: calories,
        carbs: carbs,
        fats: fats,
        protein: protein,
        sugar: sugar,
        satfat: satfat,
        fibre: fibre,
        omega3: omega3,
        group: group,
        calcium: calcium,
        vitA: vitA,
        vitB1: vitB1,
        vitB9: vitB9,
        vitC: vitC
      });
  };

  componentDidMount() {
    //Disables warning messages: TRUE FOR DEMOS
    console.disableYellowBox = true;
    global.isLoggedIn = false;
    var isFirstLaunch = "1";
    _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem("isFirstLaunch");
        if (value !== null) {
          isFirstLaunch = value;
          console.log(value);
          console.log(isFirstLaunch);
        }
      } catch (error) {
        console.log("error fetching data");
      }
    };
    _retrieveData();

    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists plate(name varchar(255) primary key not null, amount int);"
      );
      if (isFirstLaunch == "1") {
        var p = new popDB();
        console.log("First LAUNCH");
      }
    });

    _storeData = async () => {
      try {
        await AsyncStorage.setItem("isFirstLaunch", "0");
      } catch (error) {
        console.log("error setting data");
      }
    };

    _storeData();

    _removeData = async () => {
      try {
        await AsyncStorage.removeItem("isFirstLaunch");
      } catch (error) {
        console.log("error removing data");
      }
    };
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
