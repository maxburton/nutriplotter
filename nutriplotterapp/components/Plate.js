/*
	The plate that renders on the homescreen - Includes a piechart that renders the percentage of food groups on a plate (in unique colours) and renders food icons onto the plate.
	These food icons scale in size based on their percentage and rotate around the plate depending on their position in the piechart.
	Tapping on the plate opens the EditFood modal
*/

import React, { Component } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  ImageBackground,
  Image,
  Alert,
  UIManager,
  findNodeHandle
} from "react-native";

import { PieChart } from 'react-native-svg-charts'
import { Button } from "react-native-elements";
import * as WebBrowser from 'expo-web-browser';
import Modal from "react-native-modal";

import Food from "./Food";
import SideItem from "./SideItem";
import EditFood from "./EditFood";
import styles from "../themes/plateStyle";

var Datastore = require("react-native-local-mongodb"),
  platedb = new Datastore({ filename: "plate", autoload: true });

export default class Plate extends Component {
  state = {
    foods: [],
    pieSeries: [],
    pieColours: [],
    empty: true,
    isLoaded: false,
    refresh: 0,
    isModalVisible: false
  };
  constructor(props) {
    super(props);
    updateState = updateState.bind(this);
	  updateStateHome = updateStateHome.bind(this);
  }

  componentDidMount() {
    platedb.find({}, function(err, docs) {
      this.setState();
    });
    setState = () => {
      this.setState({ isLoaded: true });
    };
  }

  // Allow the plate edit modal to appear so the user can adjust what is on their plate and how much of each is on
  platePressed = () => {
    this.setState({ isModalVisible: true });
  };

  // Hide the modal so that the user can select another food/submit the plate
  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

        const pieData = data
            .filter((value) => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: randomColor(),
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
            }))
      
    var foodImages = {
      savouries: require("../assets/images/savouries.png"),
      misc: require("../assets/images/misc.png"),
      sauce: require("../assets/images/sauce.png"),
      soup: require("../assets/images/soup.png"),
      chocolate: require("../assets/images/chocolate.png"),
      snacks: require("../assets/images/snacks.png"),
      sweets: require("../assets/images/sweets.png"),
      drinks: require("../assets/images/drinks.png"),
      booze: require("../assets/images/booze.png"),
      oil: require("../assets/images/oil.png"),
      burger: require("../assets/images/burger.png"),
      game: require("../assets/images/game.png"),
      chicken: require("../assets/images/chicken.png"),
      beef: require("../assets/images/beef.png"),
      bacon: require("../assets/images/bacon.png"),
      fish: require("../assets/images/fish.png"),
      herbs: require("../assets/images/herbs.png"),
      nuts: require("../assets/images/nuts.png"),
      juice: require("../assets/images/juice.png"),
      fruit: require("../assets/images/fruit.png"),
      vegdish: require("../assets/images/vegdish.png"),
      veg: require("../assets/images/veg.png"),
      beans: require("../assets/images/beans.png"),
      potato: require("../assets/images/potato.png"),
      egg: require("../assets/images/egg.png"),
      cream: require("../assets/images/cream.png"),
      icecream: require("../assets/images/icecream.png"),
      milk: require("../assets/images/milk.png"),
      pudding: require("../assets/images/pudding.png"),
      cakes: require("../assets/images/cakes.png"),
      biscuits: require("../assets/images/biscuits.png"),
      cereals: require("../assets/images/cereals.png"),
      pastries: require("../assets/images/pastries.png"),
      bread: require("../assets/images/bread.png"),
      pizza: require("../assets/images/pizza.png"),
      pasta: require("../assets/images/pasta.png"),
      rice: require("../assets/images/rice.png"),
      sandwich: require("../assets/images/sandwich.png"),
      grains: require("../assets/images/grains.png")
    };
    if (!this.state.isLoaded) {
      return null;  // If the state has not been loaded properly, undefined behaviour has occurred: throw an error
    }

    let renderFoods = [];
    let plate = global.plate;
    let percentageSoFar = 0;
    let groupsIn = [];
    let amounts = [];
    
    // For each food group for every food on the plate
    for (let i = 0; i < plate.length; i++) {
      let group = plate[i].group;
      if (!groupsIn.includes(group)) {
        // If not seen before, add the group to groupsIn and record the amount of that food
        groupsIn.push(group);
        amounts.push({ group: group, amount: plate[i].amount });
      } else {
        // Otherwise if the food group is present, go through the plate and summate the amount of food
        // part of that food group
        for (let j = 0; j < amounts.length; j++) {
          if (group == amounts[j].group) {
            amounts[j]["amount"] = plate[i].amount + amounts[j].amount;
          }
        }
      }
    }
    // For every amount present on the plate, scale the related food group icon proportionately to the percentage
    // of the plate it takes up.
    for (let i = 0; i < amounts.length; i++) {
      let amount = amounts[i].amount;
      let imageScale = 15+100*Math.sin(amount/310); // Limit image scaling factor to keep it within the plate
      let oldPercentage = percentageSoFar;
      percentageSoFar += amount;
      let midPoint = Math.floor((percentageSoFar + oldPercentage) / 2);
      let top = 10;
      let left = 50;
      if (midPoint < 50) {
        top = 10 + Math.floor(50 * (midPoint * 0.02));
      } else {
        top = 60 + Math.floor(50 * (1 - midPoint * 0.02));
      }
      if (midPoint < 25) {
        left = 50 + Math.floor(10 * (midPoint * 0.04));
      } else if (midPoint < 75) {
        left = 60 + Math.floor(25 * (1 - midPoint * 0.04));
      } else {
        left = 10 + Math.floor(20 * (midPoint * 0.04 - 3));
      }
      if (amount == 0) {
        top = 45;
        left = 45;
      }
      let topString = top + "%";
      let leftString = left + "%";
      let group = amounts[i].group;

      // Draw the food group icon alongside the segment of the pie chart it relates to
      // and draw the segments of the pie chart. 
      renderFoods.push(
        <View
          style={{
            zIndex: 20,
            position: "absolute",
            top: topString,
            left: leftString
          }}
        >
          <Image
            style={{ height: imageScale, width: imageScale }}
            source={foodImages[group]}
          />
          <Text style={{ textAlign: "center" }}>{amount}%</Text>
        </View>
      );
    }

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
          <TouchableOpacity onPress={() => this.platePressed()}>
            <View>
            {/* Pie chart rendered here */}
              <ImageBackground
                alignContent={"center"}
                style={StyleSheet.create({ zIndex: 2 })}
                source={require("../assets/images/plate.png")}
              >

              </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>
        <Modal backdropOpacity={0} isVisible={this.state.isModalVisible}>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 4,
              borderColor: "#eee",
              borderWidth: 2,
              marginTop: "90%"
						}}
          >
						
            <TouchableOpacity
              onPress={() => this.setState({ isModalVisible: false })}
            >
              <Text style={styles.backButton}>Back to Plate</Text>
            </TouchableOpacity>
            <EditFood />
          </ScrollView>
        </Modal>
      </View>
    );
  }

  // For each food in the plate's state, add its component render JSX to
  // an array, return the array for rendering by the plate.
  renderFoodFromState() {
    var foodRender = [];

    for (const food of this.state.foods) {
      foodRender.push(food.render());
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

  // Get the names of all food items on the plate
  getFoodNames() {
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

  // Remove a food from the plate database
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
      // This is required once the field has been deleted from the database for semantics (promises should be 
      // acted upon when resolved.)
    });
  };
}
