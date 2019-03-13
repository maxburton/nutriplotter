/*
  The main screen of this app - this is what the user first sees when the app is launched and loaded
  It is the initial screen component the user is routed to from the MainTab navigator.
  
  Consists of an interactive search menu to add food items from a database (Firebase) and vary the percentage
  present on the plate, all of which is tallied into an overall score for nutrition, and into multiple nutrition
  attributes (i.e., carbs, calories etc.)
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
  ScrollView,
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


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Build a Plate"
  };

  constructor(props) {

    super(props);

    this.state = {
      isModalVisible: false,
      darkTheme: false,
      refresh: 0
    };
    this.resetGlobalTotals();
    this.toggleTheme = this.toggleTheme.bind(this);

  }
  // Retrieve the current scores for the user from the database
  updateScore = async score => {
    
    // The username of the account the user is currently signed in as.
    name = global.isLoggedIn;

    // Collect the score values from the firebase scores/ table and collect as 
    // an object of attribute -> score key/value pairs.
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
          orgDict[returnArr[i].key] = returnArr[i]["userscore"];
        }
      });

    // Get score for the user if there is one, update their current score.
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

    // Update the score for the signed in user in the database.
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

  // Occurs when the `Submit Plate` button is touched.
  _resultsClick() {
    // Check if there is any food on the plate to submit.
    if (global.plate.length > 0) {
      this._toggleModal();
    } else {
      Alert.alert("Your plate is empty!");
    }
  }

  // Calculate the overall score of the meal from how much of each nutrient is present, if it's at, above or
  // below the recommended value.
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
        }
      } else if (operator == "<") {
        let max = idealNutrients[key][1];
        if (nutrientTotal > max) {
          let pointLoss = Math.round((nutrientTotal - max) * weight);
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            warnings.push([key, "+"]);
          }
        }
      } else if (operator == ">") {
        let min = idealNutrients[key][1];
        if (nutrientTotal < min) {
          let pointLoss = Math.round((min - nutrientTotal) * weight);
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            warnings.push([key, "-"]);
          }
        }
      }
    }

    // For every time the user decides to go back from `Submit Plate` and continue working on their meal,
    // penalise them 500 points.
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

  // Calculate the percentage taken out of RDA for a nutrient
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

  // The user wants to go back and continue working on the plate, hide the modal and note down that they've
  // made a(nother) tweak.
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
    var foodDocs = global.plate;

    // Only summate total scores if there is food on the plate
    if (foodDocs.length > 0) {
      this.resetGlobalTotals(); // Clear any previous score totals
      // 0.01 for nutrients per gram, as the plate contains 500g of food, we take 5 servings of nutrients
      let multiplier = 0.05;

      // For each food item on the plate, summate their scores into the total scores
      for (let i = 0; i < foodDocs.length; i++) {
        for (var property in global.totals) {
          if (property === "omega3") {
            
            // Convert units from grams (as is given in the database) into milligrams.
            global.totals[property] += foodDocs[i].data[property] * foodDocs[i].amount * multiplier * 1000;

          } else if (property === "vitB1") {
            
            // Convert units from milligrams into micrograms.
            global.totals[property] += foodDocs[i].data[property] * (foodDocs[i].amount * multiplier) / 1000;

          } else {
            global.totals[property] +=
              foodDocs[i].data[property] * (foodDocs[i].amount * multiplier);
          }
        }
      }
      // Round scores to eliminate trailing significant figures.
      for (var key in global.totals) {
        global.totals[key] = Math.round(global.totals[key] * 10) / 10;
      }
    }

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
            
            {/* Render the plate here. */}
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

        {/* FoodList component including search bar and recently added food list. */}
        <View style={[styles.list, { marginTop: "5%" }]}>
          <List listParent={this} style={styles.list} />
        </View>

        {/* Plate submission button. */}
        <View>
          <Button
            style={styles.submitPlate}
            title={"Submit Plate"}
            onPress={() => this._resultsClick()}
          />
        </View>

        {/* Plate summary and submission modal */}
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
                {this.getSummary()}
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

  private 
  getSummary(){
    var units = {
      calories: "kcal",
      omega3: "mg",
      calcium: "mg",
      vitA: "mg",
      vitB1: "μg",
      vitB9: "μg",
      vitC: "mg"
      // The other attributes are in grams and so wont appear here (undefined gives `g`)
    }

    var summary = "\n\n";
    for (var key in global.totals) {
      summary += global.totals[key] + (units[key] || "g") + " (" + this.calculatePercentage(key, global.totals[key]) + "%)\n";
    }
    
    return summary;                
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
