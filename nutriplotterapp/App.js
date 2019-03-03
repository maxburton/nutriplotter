import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import popArray from "./populateArray";
import popList from "./populateNameList";
import firebase from "./components/Firebase.js";

var Datastore = require('react-native-local-mongodb'), 
db = new Datastore({ filename: 'foods', autoload: true });
platedb = new Datastore({ filename: 'plate', autoload: true });
savedPlatesdb = new Datastore({ filename: 'savedPlates', autoload: true });

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
        }
      } catch (error) {
        console.log("error fetching data");
      }
    };
    _retrieveData();

	var p = new popArray();
	var q = new popList();
	global.tweaks = 0;
	global.plate = [];
	global.savedPlates = new Array();
	savedPlatesdb.find({}, function (err, newDocs) {
		global.savedPlates = newDocs;
	});
	platedb.find({}, function (err, newDocs) {
		global.plate = newDocs;
		let foodDocs = global.plate;
		var totals = {
      calories: 0,
      carbs: 0,
      fats: 0,
      protein: 0,
      sugar: 0,
      satfat: 0,
      fibre: 0,
      omega3: 0,
      calcium: 0,
      vitA: 0,
      vitB1: 0,
      vitB9: 0,
      vitC: 0
    };
    if (foodDocs.length > 0) {
        for (let i = 0; i < foodDocs.length; i++) {
          totals["calories"] += Math.round(
            (foodDocs[i].data.calories * (foodDocs[i].amount * 0.01) * 100) /
              100
          );
          totals["carbs"] += Math.round(
            (foodDocs[i].data.carbs * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["fats"] += Math.round(
            (foodDocs[i].data.fats * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["protein"] += Math.round(
            (foodDocs[i].data.protein * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["sugar"] += Math.round(
            (foodDocs[i].data.sugar * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["satfat"] += Math.round(
            (foodDocs[i].data.satfat * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["fibre"] += Math.round(
            (foodDocs[i].data.fibre * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["omega3"] += Math.round(
            (foodDocs[i].data.omega3 * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["calcium"] += Math.round(
            (foodDocs[i].data.calcium * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["vitA"] += Math.round(
            (foodDocs[i].data.vitA * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["vitB1"] += Math.round(
            (foodDocs[i].data.vitB1 * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["vitB9"] += Math.round(
            (foodDocs[i].data.vitB9 * (foodDocs[i].amount * 0.01) * 100) / 100
          );
          totals["vitC"] += Math.round(
            (foodDocs[i].data.vitC * (foodDocs[i].amount * 0.01) * 100) / 100
          );
        }
		global.totals = totals;
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
