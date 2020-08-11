/*
  The main screen of this app - this is what the user first sees when the app is launched and loaded
  It is the initial screen component the user is routed to from the MainTab navigator.

  Consists of an interactive search menu to add food items from a database (Firebase) and vary the percentage
  present on the plate, all of which is tallied into an overall score for nutrition, and into multiple nutrition
  attributes (i.e., carbs, calories etc.)
*/

import React from "react";
import styles from "../themes/homeScreenStyles";
import List from "../components/FoodList.js";
import Plate from "../components/Plate.js";
import TutorialCarousel from "../components/TutorialCarousel.js"
import SideItem from "../components/SideItem.js";
import firebase from "../components/Firebase.js";
import "./LoginScreen";

import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Modal from "react-native-modal";

var Datastore = require("react-native-local-mongodb"),
  globalSettingsdb = new Datastore({ filename: 'globalSettings', autoload: true });

updateStateHome = rand => {
  this.setState({ refresh: rand });
};

export default class HomeScreen extends React.Component {
  static navigationOptions = () => ({
    title: "Build a Plate",
    headerStyle: { backgroundColor: global.colorTheme.navHeader.backgroundColor },
    headerTintColor: global.colorTheme.navHeader.color
  });

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isFirstLaunchModalVisible: false,
      refresh: 0
    };

    this.resetGlobalTotals();
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", this.refresh);
  }

  refresh = () => {
    this.setState({ refresh: Math.random() });
    // refresh header
    this.props.navigation.setParams({});
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
      .on("value", function (snapshot) {
        var returnArr = [];
        global.orgDict = {};
        currentscore = 0;

        snapshot.forEach(function (childSnapshot) {
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

  _toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  // Occurs when the `Submit Plate` button is touched.
  _resultsClick() {
    console.log("Submit plate button pressed")
    // Check if there is any food on the plate to submit.
    if (global.plate.length > 0) {
      this._toggleModal();
    } else {
      Alert.alert("Your plate is empty!");
    }
  }

  calculateScore(nutrientTotal, limit) {
    return Math.round(((nutrientTotal / limit) * 10000) / 100);
  }

  getIdealNutrients() {
    let idealNutrients = {
      calories: new Array("~", 700),
      carbs: new Array("~", 90),
      fats: new Array("~", 25),
      protein: new Array("~", 36),
      sugar: new Array("<", 30),
      satfat: new Array("<", 7),
      fibre: new Array(">", 10),
      omega3: new Array(">", 150),
      calcium: new Array(">", 333),
      vitA: new Array(">", 275),
      vitB1: new Array(">", 275),
      vitB9: new Array("~", 250),
      vitC: new Array(">", 25)
    };
    return idealNutrients;
  }

  // Calculate the overall score of the meal from how much of each nutrient is present, if it's at, above or
  // below the recommended value.
  calculateScore() {
    let idealNutrients = this.getIdealNutrients();
    let score = 13000;
    let dangerLevel = 500;
    let warnings = new Array();

    for (var key in global.totals) {
      console.log(score);
      let nutrientTotal = global.totals[key];
      let operator = idealNutrients[key][0];
      let weight = 1000 / idealNutrients[key][1];
      let ideal = idealNutrients[key][1];
      let advice = "ok";

      let acceptableRangeMultiplier = 0.15; // 15% either way
      let acceptableCustion = Math.round(acceptableRangeMultiplier * ideal);

      if (operator == "~") {
        // if nutrient has a range requirement
        let min = ideal - acceptableCustion;
        let max = ideal + acceptableCustion;

        if (nutrientTotal < min) {
          let pointLoss = Math.round((min - nutrientTotal) * weight);
          if (pointLoss > 1000) {
            pointLoss = 1000
          }
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            advice = "-";
          } else {
            // if nutrient is not perfect but also not very low
            advice = "ok";
          }
        } else if (nutrientTotal > max) {
          let pointLoss = Math.round((nutrientTotal - max) * weight);
          if (pointLoss > 1000) { pointLoss = 1000 }
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            advice = "+";
          } else {
            // if nutrient is not perfect but also not very high
            advice = "ok";
          }
        } else {
          advice = "perfect";
        }
      } else if (operator == "<") {
        // if nutrient has a maximum requirement
        if (nutrientTotal > ideal) {
          let pointLoss = Math.round((nutrientTotal - ideal) * weight);
          if (pointLoss > 1000) { pointLoss = 1000 }
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            advice = "+";
          } else {
            advice = "ok";
          }
        } else {
          advice = "perfect";
        }
      } else if (operator == ">") {
        // if nutrient has a minimum requirement
        if (nutrientTotal < ideal) {
          let pointLoss = Math.round((ideal - nutrientTotal) * weight);
          if (pointLoss > 1000) { pointLoss = 1000 }
          score -= pointLoss;
          if (pointLoss > dangerLevel) {
            advice = "-";
          } else {
            advice = "ok";
          }
        } else {
          advice = "perfect";
        }
      }

      warnings.push([key, advice, this.calculatePercentage(key, nutrientTotal), operator, ideal]);
    }

    // For every time the user decides to go back from `Submit Plate` and continue working on their meal,
    // penalise them some points.
    score -= global.tweaks * global.tweakPenalty;
    if (score < 0) {
      score = 0;
    }
    return {
      score: score,
      warnings: warnings
    };
  }

  // Calculate the percentage taken out of RDA for a nutrient
  calculatePercentage(nutrient, amount) {
    let idealNutrients = this.getIdealNutrients();
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

  // Calculate food totals since it's been loaded (see App.js for loading totals on app launch)
  calculateTotals = (foodDocs, multiplier) => {
    // For each food item on the plate, summate their scores into the total scores
    for (let i = 0; i < foodDocs.length; i++) {
      for (var property in global.totals) {
        if (property === "omega3") {
          // Convert units from grams (as is given in the database) into milligrams.
          global.totals[property] +=
            foodDocs[i].data[property] * foodDocs[i].amount * multiplier * 1000;
        } else if (property === "vitB1") {
          // Convert units from milligrams into micrograms.
          global.totals[property] +=
            foodDocs[i].data[property] * foodDocs[i].amount * multiplier * 1000;
        } else {
          global.totals[property] +=
            foodDocs[i].data[property] * (foodDocs[i].amount * multiplier);
        }
      }
    }
  };

  setFirstLaunchToFalse = () => {
    this.setState({ isFirstLaunchModalVisible: false });
    globalSettingsdb.update(
      { _id: "isFirstLaunch" },
      { $set: { value: false } }, function (err, numReplaced) {
        console.log("First launch setting updated: " + numReplaced);
      });
  }


  render() {
    console.log("Home Screen Rendering");

    // Launch tutorial modal if this is first launch
    if (global.settings.isFirstLaunch) {
      global.settings.isFirstLaunch = false;
      this.setState({ isFirstLaunchModalVisible: true });
    }

    //Calculates the total nutrients of all foods added together
    var foodDocs = global.plate;

    // Only summate total scores if there is food on the plate
    if (foodDocs.length > 0) {
      this.resetGlobalTotals(); // Clear any previous score totals
      // nutrients are listed per 100g, so we multiply by 0.01 so 1g on the plate is represented as 1g of nutrients.
      let multiplier = 0.01;

      this.calculateTotals(foodDocs, multiplier);
    }
    for (let i = 0; i < global.sideItems.length; i++) {
      if (global.sideItems[i].isIn) {
        for (var nutrient in global.sideItems[i].nutrition) {
          global.totals[nutrient] += global.sideItems[i]["nutrition"][nutrient];
        }
      }
    }

    // Round scores to eliminate trailing significant figures.
    for (var key in global.totals) {
      global.totals[key] = Math.round(global.totals[key] * 10) / 10;
    }


    return (
      <KeyboardAvoidingView
        style={[global.styles.flex1, global.colorTheme.bgColor]}
        behavior="position"
        contentContainerStyle={global.styles.flex1}
      >
        <View style={[global.styles.flex1, global.styles.flexRow]}>
          <View style={[global.styles.flex1, global.styles.flexCol]}>
            <View style={[global.styles.flex1, styles.UL]}>
              <SideItem type={"fruit"} isDown={false} />
            </View>
            <View style={[global.styles.flex1, styles.DL]}>
              <SideItem type={"dairy"} isDown={true} />
            </View>
          </View>
          <View style={styles.plateView}>
            {/* Render the plate here. */}
            <Plate />
          </View>
          <View style={[global.styles.flex1, global.styles.flexCol]}>
            <View style={[global.styles.flex1, styles.UR]}>
              <SideItem type={"bread"} isDown={false} />
            </View>
            <View style={[global.styles.flex1, styles.DR]}>
              <SideItem type={"drink"} isDown={true} />
            </View>
          </View>
        </View>

        {/* FoodList component including search bar and recently added food list. */}
        <View style={[global.styles.flex1, { marginTop: "5%" }]}>
          <List listParent={this} style={global.styles.flex1} />
        </View>

        {/* Plate submission button. */}
        <View>
          <TouchableOpacity
            style={[global.styles.button, global.colorTheme.buttonBgColor]}
            onPress={() => this._resultsClick()}
          >
            <Text style={[global.styles.buttonText, global.colorTheme.buttonTextColor]}>
              Submit Plate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tutorial modal */}
        <Modal
          backdropOpacity={0}
          animationType="slide"
          isVisible={this.state.isFirstLaunchModalVisible}
        >
          <View style={global.styles.modalContainer}>
            <TouchableOpacity
              style={global.styles.backButton}
              onPress={() => this.setFirstLaunchToFalse()}
            >
              <Text style={[global.styles.backButtonText, global.styles.blue]}>Hide</Text>
            </TouchableOpacity>
            <TutorialCarousel />
          </View>
        </Modal>

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
                {this.getNeatNames()}
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
                style={global.styles.flex1}
                onPress={() => this.tweakPlate()}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "blue"
                  }}
                >
                  Continue Tweaking (-250 points)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={global.styles.flex1}
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

  private;
  getSummary() {
    var summary = "\n\n";
    for (var key in global.totals) {
      summary +=
        global.totals[key] +
        (global.nutrientUnits[key] || "g") +
        " (" +
        this.calculatePercentage(key, global.totals[key]) +
        "%)\n";
    }

    return summary;
  }

  getNeatNames() {
    var names = "\n\n";
    for (var key in global.totals) {
      names += global.neatNutrients[key] + ":\n";
    }
    return names;
  }
}

