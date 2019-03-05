import React, { Component } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  ImageBackground,
  Alert,
  UIManager,
  findNodeHandle
} from "react-native";

import { WebBrowser, SQLite } from "expo";
import Pie from "react-native-pie";

import Food from "./Food";
import styles from "../themes/plateStyle";

const db = SQLite.openDatabase("db.db");

export default class Plate extends Component {
  state = {
    foods: [], // Food object references stored on the plate; arrange into categories via filtering for foodCategory property.
    pieSeries: [],
    pieColours: [],
    empty: true,
    // Total running score of all food on plate
    score: {
      calcium: 0,
      calories: 0,
      carbs: 0,
      fats: 0,
      fibre: 0,
      group: 0,
      omega3: 0,
      protein: 0,
      satfat: 0,
      sugar: 0,
      vitA: 0,
      vitB1: 0,
      vitB9: 0,
      vitC: 0
    }
  };

<<<<<<< HEAD
  // Set up the plate to be constructed with score and foods, which are 0s and empty (resp.) by default
  constructor(props){
    super(props);
    this.state.score = props.score;
    this.state.foods = props.foods;
  }
=======
  
>>>>>>> parent of 502d547... Allow food items to be saved in the plate. Add NutritionChart component for later presentation of plate nutrition stats.

  onPlateClick = () => {
    console.log("Plate Clicked");
    var dbQuery = "select name, amount from plate;";
    //alert(item.name);
    // Promises are for error handling operations, particularly asynchronous I/O operations:
    // 	- we promise to return a valid answer or deal with it.
    var promise = new Promise(function(resolve, reject) {
      db.transaction(function(transaction) {
        transaction.executeSql(
          dbQuery,
          [],
          function(transaction, result) {
            resolve(JSON.stringify(result)); // here the returned Promise is resolved
          },
          nullHandler,
          errorHandler
        );
      });
    });

    function nullHandler(result) {
      console.log(
        "Database promise evoked nullHandler on account of a null error!"
      );
      console.log("Null Log : " + JSON.stringify(result));
    }

    function errorHandler(error) {
      console.log(
        "Database promise evoked errorHandler on account of an error occurring!"
      );
      console.log("Error Log : " + error);
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Nothing went wrong so we proceed with the result.
    promise.then(results => {
      var dbOut = JSON.parse(results);
      var length = dbOut.rows.length;
      var allFoods = "";
      for (i = 0; i < length; i++) {
        allFoods =
          allFoods +
          (i + 1) +
          ". " +
          capitalizeFirstLetter(dbOut.rows._array[i].name) +
          "\n";
      }
      if (length == 0) {
        //alert("Your plate is empty! Add some by searching below.");
      } else {
        //alert(allFoods);
      }
    });
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <View
          style={styles.plate}
          onLayout={event => {
            var dimension = event.nativeEvent.layout;
            this.state.dimensions = {
              x: dimension.x,
              y: dimension.y,
              width: dimension.width,
              height: dimension.height,
              center: {
                x: dimension.x + Math.floor(dimension.width / 2),
                y: dimension.y + Math.floor(dimension.height / 2)
              },
              radius: Math.floor(dimension.width / 2)
            };
          }}
        >
          <ImageBackground
            alignContent={"center"}
            style={StyleSheet.create({ zIndex: 0 })}
            source={require("../assets/images/plate.png")}
          >
            <Pie
              // Make the pie chart a ring around the plate which fills up based on the foods present
              radius={105}
              innerRadius={81}
              on
              left={25}
              series={this.state.pieSeries}
              //values to show and color sequentially
              colors={this.state.pieColours}
              style={StyleSheet.create({ zIndex: 1 })}
            />
          </ImageBackground>
        </View>

        {this.renderFoodFromState()}
      </View>
    );
  }

  // For each food in the plate's state, add its component render JSX to
  // an array, return the array for rendering by the plate.
  renderFoodFromState() {
    var foodRender = [];

    for (const food of this.state.foods) {
      foodRender.push(food.render());
      console.log(food);
    }
    return foodRender;
  }

  // Give the % of the pie chart as a given nutrition score, which dynamically updates to reflect
  // what's on the plate.
  renderPieSeries = function() {
    return [this.state.nutritionScore];
  };

  clearFoodState() {
    this.state.foods = [];
    this.state.empty = true;
  }

  // Add a food object onto this plate.
  addFood(food) {
    this.state.foods[this.state.foods.length] = food;
    for (var scoreKey in this.state.score) {
      this.state.score[scoreKey] += food.score[scoreKey];
    }
<<<<<<< HEAD
    console.log("Added " + food.state.name + " to plate.");
    console.log(this.getNutritionScores());
=======
    console.log("Added "+food.name +" to plate.");
>>>>>>> parent of 502d547... Allow food items to be saved in the plate. Add NutritionChart component for later presentation of plate nutrition stats.
  }

  // Remove a food object from this plate.
  removeFood(food) {
    if (this.state.foods.length < 1) {
      console.log("Failed to remove "+ food.name + " from plate: there are no foods stored within this plate's state.");
      return;
    }
<<<<<<< HEAD
    
    let newFoods = this.state.foods.slice()
                                    .filter(item => item.state.name !== food.state.name);
    
    this.state.foods = [...newFoods];

    var newScores = JSON.parse(JSON.stringify(this.state.score));

    for (var scoreKey in this.state.score) {
      // Take the score of the removed food from the plate's total score.
      newScores[scoreKey] = this.state.score[scoreKey] - food.score[scoreKey];
    }
    
    this.state.score = newScores;
    
    console.log("Removed " + food.state.name + " from plate.");
    console.log(this.getNutritionScores());
=======

    for (var i = 0; i < this.state.foods.length; i++) {
      if (this.state.foods[i] == food) {
        this.state.foods = this.state.foods.splice(i, 1); // Remove the element at i in-place
        for (var scoreKey in this.state.foods) {
          // Take the score of the removed food from the plate's total score.
          this.state.score[scoreKey] -= food.state.score[scoreKey]; 
        }
        console.log("Removed "+food.name+ " from plate.");
      }
    }
>>>>>>> parent of 502d547... Allow food items to be saved in the plate. Add NutritionChart component for later presentation of plate nutrition stats.
  }

  // Get the names of all food items on the plate
  getFoodNames() {
    console.log("Getting food names");
    if (this.state.empty) {
      return "The plate is empty.";
    } else {
      //console.log(this.state.foods);
      var s = "[";
      for (i = 0; i < this.state.foods.length; i++) {
        s += this.state.foods[i].state.name + ",";
      }
      s += "]";
      return s;
    }
  }

<<<<<<< HEAD
  getNutritionScores(){
    for (var scoreKey in this.state.score){
      console.log(scoreKey + ": " + this.state.score[scoreKey]);
    }
  }

=======
>>>>>>> parent of 502d547... Allow food items to be saved in the plate. Add NutritionChart component for later presentation of plate nutrition stats.
  deleteItem = searchString => {
    var dbQuery = "select name from foods;";
    var promise = new Promise(function(resolve, reject) {
      db.transaction(function(transaction) {
        transaction.executeSql(
          dbQuery,
          [],
          function(transaction, result) {
            resolve(JSON.stringify(result)); // here the returned Promise is resolved
          },
          nullHandler,
          errorHandler
        );
      });
    });

    function nullHandler(result) {
      console.log("Null Log : " + JSON.stringify(result));
    }

    function errorHandler(error) {
      console.log("Error Log : " + error);
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    promise.then(results => {
      //code runs after field deleted
    });
  };
}

Plate.defaultProps = {
  foods: [],
  score: {
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
  },
  empty: true
}
