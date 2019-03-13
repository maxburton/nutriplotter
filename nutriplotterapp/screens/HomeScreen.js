/*
	The main screen of this app - this is what the user first sees when the app is launched and loaded
*/

import React from "react";
import List from "../components/FoodList.js";
import Plate from "../components/Plate.js";
import SideItem from "../components/SideItem.js";
import firebase from "../components/Firebase.js";
import "./LoginScreen";
import { Card, Button } from "react-native-elements";
//Initliase firebase database
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  measure,
  Alert,
  ImageBackground
} from "react-native";
import Modal from "react-native-modal";
import { WebBrowser, SQLite } from "expo";

import { MonoText } from "../components/StyledText";
import getStyleSheet from "../themes/style";

var Datastore = require("react-native-local-mongodb"),
  platedb = new Datastore({ filename: "plate", autoload: true });

import Food from "../components/Food";

updateStateHome = (rand) =>{
    this.setState({"refresh": rand})
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Build a Plate"
  };

  constructor(props) {
    // Window is the draw space available for the app (does not include Android notification bar)
    //this.state.window = {
    //  height: Dimensions.get('window').height,
    //  width: Dimensions.get('window').width
    //};

    super(props);

    this.state = {
      isModalVisible: false,
      darkTheme: false,
      refresh: 0
    };
    this.resetGlobalTotals();
    this.toggleTheme = this.toggleTheme.bind(this);

    // When creating the homescreen, create a reference to the plate to be rendered
    // so that we may be able to call methods on the plate and manipulate its state from other components
    // on the screen.
  }
  
  updateChild = (rand) => {
      updateStateHome(rand)
  }
  
  componentDidMount(){
        this.load()
        this.props.navigation.addListener('willFocus', this.load)
    }
    load = () => {
        this.updateChild(Math.random());
    }

  updateScore = async score => {
    //get scores as dict
    name = global.isLoggedIn;
    firebase
      .database()
      .ref("scores/")
      .on("value", function(snapshot) {
        var returnArr = [];
        global.orgDict = {};
        currentscore = 0;

        snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          item.key = childSnapshot.key;

          returnArr.push(item);
        });

        for (var i = 0; i < returnArr.length; i++) {
          orgDict[returnArr[i]["key"]] = returnArr[i]["userscore"];
        }
      });

    //get currentscore and add this score
    if (orgDict[name]) {
      currentscore = orgDict[name];
      if (score > currentscore) {
        newscore = score;
      } else {
        newscore = currentscore;
      }
    } else {
      newscore = score;
    }

    //update userscore in db
    firebase
      .database()
      .ref("scores/" + name)
      .update({
        userscore: newscore
      });
  };

  toggleTheme() {
    this.setState({ darkTheme: !this.state.darkTheme });
  }

  _toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  toggleTheme() {
    this.setState({ darkTheme: !this.state.darkTheme });
  }

  _resultsClick() {
    //check plate size
    if (global.plate.length > 0) {
      this._toggleModal();
    } else {
      Alert.alert("Your plate is empty!");
    }
  }

  calculateScore() {
    let idealNutrients = {
      calories: new Array("-", 700, 600, 800),
      carbs: new Array("-", 30, 17, 51),
      fats: new Array("-", 21, 15, 26),
      protein: new Array("-", 24, 15, 33),
      sugar: new Array("<", 10),
      satfat: new Array("<", 8),
      fibre: new Array(">", 10),
      omega3: new Array(">", 150),
      calcium: new Array(">", 333),
      vitA: new Array(">", 275),
      vitB1: new Array(">", 275),
      vitB9: new Array("-", 250, 160, 333),
      vitC: new Array(">", 25)
    };
    let score = 13000;
    let dangerLevel = 500;
    let warnings = new Array();
    for (var key in global.totals) {
      let nutrientTotal = global.totals[key];
      let operator = idealNutrients[key][0];
      let weight = 1000 / idealNutrients[key][1];
      if (operator == "-") {
        let min = idealNutrients[key][2];
        let max = idealNutrients[key][3];
        if (nutrientTotal < min) {
          let pointLoss = Math.round((min - nutrientTotal) * weight);
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            warnings.push([key, "-"]);
          }
        } else if (nutrientTotal > max) {
          let pointLoss = Math.round((nutrientTotal - max) * weight);
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            warnings.push([key, "+"]);
          }
		  if (pointLoss == 0){
			warnings.push([key, "perfect"]);
		  }
        } else{
			console.log("PERFECT ADDED");
			warnings.push([key, "perfect"]);
		  }
      } else if (operator == "<") {
        let max = idealNutrients[key][1];
        if (nutrientTotal > max) {
          let pointLoss = Math.round((nutrientTotal - max) * weight);
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            warnings.push([key, "+"]);
          }
        } else{
			warnings.push([key, "perfect"]);
		  }
      } else if (operator == ">") {
        let min = idealNutrients[key][1];
        if (nutrientTotal < min) {
          let pointLoss = Math.round((min - nutrientTotal) * weight);
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            warnings.push([key, "-"]);
          }
        } else{
			warnings.push([key, "perfect"]);
		  }
      }
    }
    score -= global.tweaks * 500;
    if (score < 0) {
      score = 0;
    }
    console.log("Score: " + score);
    return {
      score: score,
      warnings: warnings
    };
  }

  calculatePercentage(nutrient, amount) {
    let idealNutrients = {
      calories: new Array("-", 700, 600, 800),
      carbs: new Array("-", 30, 17, 51),
      fats: new Array("-", 21, 15, 26),
      protein: new Array("-", 24, 15, 33),
      sugar: new Array("<", 10),
      satfat: new Array("<", 8),
      fibre: new Array(">", 10),
      omega3: new Array(">", 150),
      calcium: new Array(">", 333),
      vitA: new Array(">", 275),
      vitB1: new Array(">", 275),
      vitB9: new Array("-", 250, 160, 333),
      vitC: new Array(">", 25)
    };
    let idealAmount = idealNutrients[nutrient][1];
    let percentage = Math.floor((amount / idealAmount) * 100);
    return percentage;
  }

  submitPlate = () => {
    this.setState({ isModalVisible: false });
    let scoreArray = this.calculateScore();
    let warnings = scoreArray["warnings"];
    let score = scoreArray["score"];
    this.updateScore(score);
    console.log("Score: " + score);
    this.props.navigation.navigate("ScoreScreen", {
      plate: global.plate,
      tweaks: global.tweaks,
      score: score,
      warnings: warnings
    });
  };

  tweakPlate = () => {
    this.setState({ isModalVisible: false });
    global.tweaks++;
  };

  resetGlobalTotals = () => {
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
  };

  render() {
	console.log("RENDERED");
	calculateTotals = (foodDocs, i, multiplier) =>{
		global.totals["calories"] +=
          foodDocs[i].data.calories * (foodDocs[i].amount * multiplier);
        global.totals["carbs"] +=
          foodDocs[i].data.carbs * (foodDocs[i].amount * multiplier);
        global.totals["fats"] +=
          foodDocs[i].data.fats * (foodDocs[i].amount * multiplier);
        global.totals["protein"] +=
          foodDocs[i].data.protein * (foodDocs[i].amount * multiplier);
        global.totals["sugar"] +=
          foodDocs[i].data.sugar * (foodDocs[i].amount * multiplier);
        global.totals["satfat"] +=
          foodDocs[i].data.satfat * (foodDocs[i].amount * multiplier);
        global.totals["fibre"] +=
          foodDocs[i].data.fibre * (foodDocs[i].amount * multiplier);
        global.totals["omega3"] +=
          foodDocs[i].data.omega3 * (foodDocs[i].amount * multiplier * 1000); //multiplied by 1000 because data is in grams but should be in mg
        global.totals["calcium"] +=
          foodDocs[i].data.calcium * (foodDocs[i].amount * multiplier);
        global.totals["vitA"] +=
          foodDocs[i].data.vitA * (foodDocs[i].amount * multiplier);
        global.totals["vitB1"] +=
          foodDocs[i].data.vitB1 * ((foodDocs[i].amount * multiplier) / 1000); //divided by 1000 because data is in mg but should be in micrograms
        global.totals["vitB9"] +=
          foodDocs[i].data.vitB9 * (foodDocs[i].amount * multiplier);
        global.totals["vitC"] +=
          foodDocs[i].data.vitC * (foodDocs[i].amount * multiplier);
	}
	  
	//Calculates the total nutrients of all foods added together
    var foodDocs = global.plate;
    if (foodDocs.length > 0) {
      this.resetGlobalTotals();
      let multiplier = 0.05; // 0.01 to get nutrients per gram, then x5 to have a total plate weight of 500g
      for (let i = 0; i < foodDocs.length; i++) {
        calculateTotals(foodDocs, i, multiplier);
      }
	  
    }
	for(let i = 0; i < global.sideItems.length; i++){
		if(global.sideItems[i].isIn){
			for (var nutrient in global.sideItems[i].nutrition){
				global.totals[nutrient] += global.sideItems[i]["nutrition"][nutrient];
			}
		}
	}
	for (var key in global.totals) {
        global.totals[key] = Math.round(global.totals[key] * 10) / 10;
    }
    //const styles = getStyleSheet(this.state.darkTheme);

    //const styles = getStyleSheet(this.state.darkTheme);
    //const backgroundColor = StyleSheet.flatten(styles.container).backgroundColor;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
        contentContainerStyle={styles.container}
      >
        <View style={styles.wholePlateView}>
          <View style={styles.leftPlateView}>
            <View style={styles.UL}>
              <SideItem type={"fruit"} isDown={false} />
            </View>
            <View style={styles.DL}>
              <SideItem type={"dairy"} isDown={true} />
            </View>
          </View>
          <View style={styles.plateView}>
            <Plate />
          </View>
          <View style={styles.rightPlateView}>
            <View style={styles.UR}>
              <SideItem type={"bread"} isDown={false} />
            </View>
            <View style={styles.DR}>
              <SideItem type={"drink"} isDown={true} />
            </View>
          </View>
        </View>

        <View style={[styles.list, { marginTop: "5%" }]}>
          <List listParent={this} style={styles.list} />
        </View>

        <View>
          <Button
            style={styles.submitPlate}
            title={"Submit Plate"}
            onPress={() => this._resultsClick()}
          />
        </View>

        {/**view start**/}
        <Modal
          backdropOpacity={0.5}
          swipeDirection="down"
          onSwipe={() => this.tweakPlate()}
          isVisible={this.state.isModalVisible}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 8,
              borderColor: "#000",
              borderWidth: 3,
              marginHorizontal: 10,
              marginVertical: 60,
              padding: 8
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 24,
                textAlign: "center"
              }}
            >
              Your Plate
            </Text>
            <View
              style={{
                flex: 3,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  paddingRight: 10
                }}
              >
                {[
                  "\n\nCalories: \n",
                  "Carbohydrates: \n",
                  "Fats: \n",
                  "Protein: \n",
                  "Sugar: \n",
                  "Saturated Fats: \n",
                  "Fibre: \n",
                  "Omega3: \n",
                  "Calcium: \n",
                  "Vitamin A: \n",
                  "Vitamin B1: \n",
                  "Vitamin B9: \n",
                  "Vitamin C: \n"
                ]}
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                  paddingLeft: 10
                }}
              >
                {[
                  "\n\n" +
                    global.totals["calories"] +
                    "kcal  (" +
                    this.calculatePercentage(
                      "calories",
                      global.totals["calories"]
                    ) +
                    "%)\n",
                  global.totals["carbs"] +
                    "g  (" +
                    this.calculatePercentage("carbs", global.totals["carbs"]) +
                    "%)\n",
                  global.totals["fats"] +
                    "g  (" +
                    this.calculatePercentage("fats", global.totals["fats"]) +
                    "%)\n",
                  global.totals["protein"] +
                    "g  (" +
                    this.calculatePercentage(
                      "protein",
                      global.totals["protein"]
                    ) +
                    "%)\n",
                  global.totals["sugar"] +
                    "g  (" +
                    this.calculatePercentage("sugar", global.totals["sugar"]) +
                    "%)\n",
                  global.totals["satfat"] +
                    "g  (" +
                    this.calculatePercentage(
                      "satfat",
                      global.totals["satfat"]
                    ) +
                    "%)\n",
                  global.totals["fibre"] +
                    "g  (" +
                    this.calculatePercentage("fibre", global.totals["fibre"]) +
                    "%)\n",
                  global.totals["omega3"] +
                    "mg  (" +
                    this.calculatePercentage(
                      "omega3",
                      global.totals["omega3"]
                    ) +
                    "%)\n",
                  global.totals["calcium"] +
                    "mg  (" +
                    this.calculatePercentage(
                      "calcium",
                      global.totals["calcium"]
                    ) +
                    "%)\n",
                  global.totals["vitA"] +
                    "mg  (" +
                    this.calculatePercentage("vitA", global.totals["vitA"]) +
                    "%)\n",
                  global.totals["vitB1"] +
                    "μg  (" +
                    this.calculatePercentage("vitB1", global.totals["vitB1"]) +
                    "%)\n",
                  global.totals["vitB9"] +
                    "μg  (" +
                    this.calculatePercentage("vitB9", global.totals["vitB9"]) +
                    "%)\n",
                  global.totals["vitC"] +
                    "mg  (" +
                    this.calculatePercentage("vitC", global.totals["vitC"]) +
                    "%)\n"
                ]}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.tweakPlate()}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "blue"
                  }}
                >
                  Continue Tweaking (-500 points)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.submitPlate()}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "blue"
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const offset = 24;
const { width, height } = require("Dimensions").get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  plateView: {
    flex: 1,
    marginTop: "10%"
  },
  wholePlateView: {
    flex: 1,
    flexDirection: "row"
  },
  leftPlateView: {
    flex: 1,
    flexDirection: "column"
  },
  rightPlateView: {
    flex: 1,
    flexDirection: "column"
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset
  },
  submitPlate: {
    alignItems: "center",
    marginTop: 3,
    fontSize: offset
  },
  buttonText: {
    marginLeft: offset,
    fontSize: offset
  },
  model: {
    backgroundColor: "white"
  },
  childStyle: {
    fontSize: 72,
    color: "red"
  },
  modelContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: height - offset * 3,
    backgroundColor: "white"
  },
  modelColumn: {
    flex: 5,
    flexDirection: "column",
    marginLeft: offset * 3
  },
  innerView: {},
  description: {
    padding: 20,
    fontSize: 18
  },
  outerView: {
    flex: 1,
    backgroundColor: "#00000080"
  },
  UL: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  DL: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  UR: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  DR: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  SP: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
