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
sideItemsdb = new Datastore({ filename: 'sideItems', autoload: true });

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
	let loadingCount = 0;
	loadingCheck = () =>{
		loadingCount++;
		if(loadingCount >= 3){
			this.setState({isLoaded: true});
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

	var p = new popArray();
	var q = new popList();
	global.tweaks = 0;
	global.plate = [];
	global.totals = {};
	global.savedPlates = new Array();
	global.maximum = 100;
	savedPlatesdb.find({}, function (err, newDocs) {
		global.savedPlates = newDocs;
		loadingCheck();
	});
	global.sideItems = [{type: "fruit", isIn: false, nutrition: []}, {type: "dairy", isIn: false, nutrition: []}, {type: "bread", isIn: false, nutrition: []}, {type: "drink", isIn: false, nutrition: []}];
	sideItemsdb.find({}, function (err, newDocs) {
		if(newDocs.length > 3){
			global.sideItems = newDocs;
			loadingCheck();
		}else{
			sideItemsdb.insert([{type: "fruit", isIn: false, nutrition: []}, {type: "dairy", isIn: false, nutrition: []}, {type: "bread", isIn: false, nutrition: []}, {type: "drink", isIn: false, nutrition: []}], function (err, newDocs) {
				loadingCheck();
			});
		}
	});
	
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
		"chicken": "9D721D",
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
		let multiplier = 0.05; // 0.01 to get nutrients per gram, then x5 to have a total plate weight of 500g
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
			
			for(var key in global.totals){
				global.totals[key] = Math.round(global.totals[key] * 10) / 10;
			}
        }
	}
	loadingCheck();
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
