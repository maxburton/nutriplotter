import React from "react";
import List from "../components/FoodList.js";
import Plate from "../components/Plate.js";
import firebase from "../components/Firebase.js";
import "./LoginScreen";

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
  Button,
  Dimensions,
  measure
} from "react-native";
import Modal from "react-native-modal";
import { WebBrowser, SQLite } from "expo";

import { MonoText } from "../components/StyledText";
import getStyleSheet from "../themes/style";

var Datastore = require("react-native-local-mongodb"),
  platedb = new Datastore({ filename: "plate", autoload: true });

import Food from "../components/Food";

let defaultScore = {
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

export const windowDimensions = {
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width
};

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Play with Your Food"
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
      totals: {
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
      }
    };
    this.toggleTheme = this.toggleTheme.bind(this);

    // When creating the homescreen, create a plate with the given score and foods props:
    // on app start up, the empty default props are used, otherwise, the values sent via the
    // navigate props are used to instantiate the plate
    this.plate = new Plate({
      styles: getStyleSheet(this.state.darkTheme),
      foods: props.foods,
      score: props.score
    });
  }

  // ************* NEEDS A 'SUBMIT' BUTTON TO WORK, CURRENTLY NOT ONE *************
  updateScore = async (name, score) => {
    console.log(global.isLoggedIn);
    //get scores as dict
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
      newscore = currentscore + score;
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
    /**check plate size**/
    /**var contents = this._getPlateContents();**/

    if (this.plate.state.foods.length < 1) {
      alert("Try adding some food first!");
    } else {
      /**display results**/
      this._toggleModal();
    }
  }

  componentDidMount() {
    var totals = defaultScore;

    var foodDocs = global.plate;
    if (foodDocs.length > 0) {
      for (let i = 0; i < foodDocs.length; i++) {
        totals["calories"] += Math.round(
          (foodDocs[i].data.calories * (foodDocs[i].amount * 0.01) * 100) / 100
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
      updateState();
    }

    updateState = () => {
      this.setState({ totals: totals });
    };
  }

  render() {
    const styles = getStyleSheet(this.state.darkTheme);
    // Use previous plate data if coming from another screen, otherwise create a new plate component with the
    // current theme.
    this.plate = this.props.navigation.getParam(
      "plate",
      new Plate({
        style: this.styles,
        foods: this.props.navigation.getParam("foods", []),
        score: this.props.navigation.getParam("score", defaultScore)
      })
    );

    var apple = new Food({
      name: "apples",
      score: {
        calories: 51,
        carbs: 11.6,
        fats: 0.5,
        protein: 0.6,
        sugar: 11.6,
        satfat: 0.12,
        fibre: 2.5,
        omega3: 0.2,
        calcium: 0,
        vitA: 14.0,
        vitB1: 0.04,
        vitB9: 0,
        vitC: 6
      },
      plate: this.plate
    });
    var food = new Food({ name: "Foo", plate: this.plate });
    var food2 = new Food({ name: "Foo2", plate: this.plate });
    var food3 = new Food({ name: "Foo3", plate: this.plate });

    //const styles = getStyleSheet(this.state.darkTheme);
    //const backgroundColor = StyleSheet.flatten(styles.container).backgroundColor;

    return (
      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            flexDirection: "column",
            justifyContent: "center",
           // alignItems: "stretch"
          }
        ]}
        behavior="position"
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("EditFoodScreen", {
              plate: this.plate,
              foods: this.plate.state.foods,
              score: this.plate.state.score
            })
          }
          style={{
            backgroundColor: "skyblue",
            zIndex: 10
          }}
        >
          <Text style={{ fontSize: 24 }}>Edit</Text>
        </TouchableOpacity>

        {apple.render()}
        {/* Central block */}

        {this.plate.render()}

        {/* Bottommost content*/}

        <View style={{zIndex: -1}}>
          <Button title={'Submit'} 
            onPress={() => this._resultsClick()}>
          </Button>
        </View>

          <View style={[styles.list, {
            zIndex: -1
          }]}>
            <List style={styles.list} />
          </View>

        {/**view start**/}
        <Modal
          backdropOpacity={0.5}
          swipeDirection="left"
          onSwipe={this.closeModal}
          isVisible={this.state.isModalVisible}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 8,
              borderColor: "#000",
              borderWidth: 2,
              marginHorizontal: 30,
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
                  "\n\n" + this.plate.state.score["calories"] + "\n",
                  this.plate.state.score["carbs"] + "\n",
                  this.plate.state.score["fats"] + "\n",
                  this.plate.state.score["protein"] + "\n",
                  this.plate.state.score["sugar"] + "\n",
                  this.plate.state.score["satfat"] + "\n",
                  this.plate.state.score["fibre"] + "\n",
                  this.plate.state.score["omega3"] + "\n",
                  this.plate.state.score["calcium"] + "\n",
                  this.plate.state.score["vitA"] + "\n",
                  this.plate.state.score["vitB1"] + "\n",
                  this.plate.state.score["vitB9"] + "\n",
                  this.plate.state.score["vitC"] + "\n"
                ]}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.setState({ isModalVisible: false })}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "blue"
                  }}
                >
                  Tweak Your Plate
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.setState({ isModalVisible: false })}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "blue"
                  }}
                >
                  Submit Your Plate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*<Button
          title="Increment Score By 200"
          onPress={() => this.updateScore(global.isLoggedIn, 200)}
        >
          <Text>Increment Score By 200</Text>
        </Button>*/}
      </KeyboardAvoidingView>
    );
  }
}

HomeScreen.defaultProps = {
  foods: [],
  score: {}
};

const offset = 24;
const { width, height } = require("Dimensions").get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
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
  }
});
