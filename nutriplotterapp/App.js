/*
	Runs on launch - initialises local databases, gets all relevant information from mongodb, a persistent storage solution and waits for all aspects to be loaded before
	redirecting the user to HomeScreen
*/

import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import { AppLoading } from "expo";
import * as Icon from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import AppNavigator from "./navigation/AppNavigator";
import popDatabase from "./populateDatabase";
import popArray from "./populateArray";
import popList from "./populateNameList";
import popSideItems from "./populateSideItems";
import popSavedPlates from "./populateSavedPlates";
import popSettings from "./populateSettings";
import firebase from "./components/Firebase.js";

var Datastore = require('react-native-local-mongodb'),
  db = new Datastore({ filename: 'foods', autoload: true });
platedb = new Datastore({ filename: 'plate', autoload: true });
savedPlatesdb = new Datastore({ filename: 'savedPlates', autoload: true });
sideItemsdb = new Datastore({ filename: 'sideItems', autoload: true });
favdb = new Datastore({ filename: 'favourites', autoload: true });
settingsdb = new Datastore({ filename: 'settings', autoload: true });

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isLoaded: false,
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
    // Wait until all content is fetched from DBs, then render
    let loadingCount = 0;
    componentLoaded = () => {
      loadingCount++;
      if (loadingCount >= 5) {
        this.setState({ isLoaded: true });
        console.log("All App.js components & global variables loaded")
      }
    }

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


    // populate mongoDB of all foods if it's empty
    db.find({}, function (err, foodDB) {
      if (foodDB.length == 0) {
        new popDatabase();
      }
    });

    new popArray();
    new popList();
    new popSideItems();
    global.tweaks = 0;
    global.tweakPenalty = 250;
    global.plate = [];
    global.totals = {};
    global.savedPlates = new Array();
    global.maximum = 100;
    global.settings = {};
    global.populatedSettings = false;

    // initialise (populate) mongoDB of settings if it's empty
    settingsdb.find({}, function (err, settings) {
      if (settings.length == 0) {
        new popSettings();

        // wait until settings are populated to continue
        while (!global.populatedSettings){
          continue;
        }
      }

      // convert mongodb into global json array
      settingsdb.find({}, function (err, fetchedSettings) {
        // convert object to map
        fetchedSettings = fetchedSettings;
        settingsMap = {};

        for (let i = 0; i < fetchedSettings.length; i++) {
          let fetchedSetting = fetchedSettings[i];
          let key = fetchedSetting["_id"];
          let value = fetchedSetting["value"];
          settingsMap[key] = value;
        }
        global.settings = settingsMap;

        console.log("\n\nGLOBAL SETTINGS:")
        console.log(global.settings)
        componentLoaded();
      });
    });

    savedPlatesdb.find({}, function (err, savedPlates) {
      if (savedPlates.length > 0) {
        global.savedPlates = savedPlates;
        componentLoaded();
      } else {
        new popSavedPlates(); //Load in default saved plates
        savedPlatesdb.insert(global.savedPlates[0], function (err, newDoc) {
          componentLoaded();
        });
      }
    });

    sideItemsdb.find({}, function (err, sideItems) {
      if (sideItems.length > 0) {
        global.sideItems = sideItems;
        componentLoaded();
      } else {
        sideItemsdb.insert(global.sideItems, function (err, sideItems) {
          componentLoaded();
        });
      }
    });

    global.favourites = [];
    favdb.find({}, function (err, fav) {
      global.favourites = fav;
      componentLoaded();
    });

    // Names of all nutrients nicely formatted
    global.neatNutrients = {
      calories: "Calories",
      carbs: "Carbohydrates",
      fats: "Fats",
      protein: "Protein",
      sugar: "Sugar",
      satfat: "Saturated Fats",
      fibre: "Fibre",
      omega3: "Omega3",
      calcium: "Calcium",
      vitA: "Vitamin A",
      vitB1: "Vitamin B1",
      vitB9: "Vitamin B9",
      vitC: "Vitamin C"
    };

    // Units for each nutrient
    global.nutrientUnits = {
      calories: "kcal",
      omega3: "mg",
      calcium: "mg",
      vitA: "mg",
      vitB1: "μg",
      vitB9: "μg",
      vitC: "mg"
      // The other attributes are in grams and so wont appear here (undefined gives `g`)
    };

    // Colours of pie chart for each group
    global.colours = {
      "grains": "#EFCC6D",
      "sandwich": "#AF881F",
      "rice": "#F3EAD2",
      "pasta": "#F4E57E",
      "pizza": "#E37536",
      "bread": "#CA952A",
      "cereals": "#F4C973",
      "biscuits": "#9D6F13",
      "cakes": "#DE3BA7",
      "pastries": "#CD9848",
      "pudding": "#6B4610",
      "savouries": "#AB854B",
      "milk": "#F7F0E6",
      "cream": "#E6F1F7",
      "cheese": "#FEF602",
      "icecream": "#E9F7E6",
      "egg": "#FEDD02",
      "potato": "#E6CE56",
      "beans": "#4A7325",
      "veg": "#75D125",
      "vegdish": "#B4E888",
      "fruit": "#EA0606",
      "juice": "#FEB201",
      "nuts": "#C19A3F",
      "herbs": "#2A9547",
      "fish": "#668390",
      "bacon": "#CB5639",
      "beef": "#BA492D",
      "chicken": "#9D721D",
      "game": "#8D6E31",
      "burger": "#82581A",
      "oil": "#FAF5B0",
      "drinks": "#22C9F3",
      "booze": "#6132BF",
      "sweets": "#D805F9",
      "chocolate": "#603C12",
      "snacks": "#D1C737",
      "soup": "#ECD6E8",
      "sauce": "#BD2121",
      "misc": "#010101",
    }

    platedb.find({}, function (err, newDocs) {
      global.plate = newDocs;
      let foodDocs = global.plate;
      global.totals = {
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

      // Get the nutritional info for all foods already on the plate on load
      if (foodDocs.length > 0) {
        let multiplier = 0.01; // nutrients are listed per 100g, so we multiply by 0.01 so 1g on the plate is represented as 1g of nutrients.
        for (let i = 0; i < foodDocs.length; i++) {

          global.totals["calories"] += foodDocs[i].data.calories * (foodDocs[i].amount * multiplier);
          global.totals["carbs"] += foodDocs[i].data.carbs * (foodDocs[i].amount * multiplier);
          global.totals["fats"] += foodDocs[i].data.fats * (foodDocs[i].amount * multiplier);
          global.totals["protein"] += foodDocs[i].data.protein * (foodDocs[i].amount * multiplier);
          global.totals["sugar"] += foodDocs[i].data.sugar * (foodDocs[i].amount * multiplier);
          global.totals["satfat"] += foodDocs[i].data.satfat * (foodDocs[i].amount * multiplier);
          global.totals["fibre"] += foodDocs[i].data.fibre * (foodDocs[i].amount * multiplier);
          global.totals["omega3"] += foodDocs[i].data.omega3 * (foodDocs[i].amount * multiplier * 1000); //multiplied by 1000 because data is in grams but should be in mg
          global.totals["calcium"] += foodDocs[i].data.calcium * (foodDocs[i].amount * multiplier);
          global.totals["vitA"] += foodDocs[i].data.vitA * (foodDocs[i].amount * multiplier);
          global.totals["vitB1"] += foodDocs[i].data.vitB1 * (foodDocs[i].amount * multiplier / 1000); //divided by 1000 because data is in mg but should be in micrograms
          global.totals["vitB9"] += foodDocs[i].data.vitB9 * (foodDocs[i].amount * multiplier);
          global.totals["vitC"] += foodDocs[i].data.vitC * (foodDocs[i].amount * multiplier);

          for (var key in global.totals) {
            global.totals[key] = Math.round(global.totals[key] * 10) / 10;
          }
        }
      }
      componentLoaded();
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
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen || !this.state.isLoaded) {
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
