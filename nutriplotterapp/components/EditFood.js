/*
	A modal that pops up on the homescreen, that allows users to use sliders and buttons to change the percentage of the food on the plate, or delete an item.
	Also provides a button to clear the plate of all foods.
*/

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Slider,
} from "react-native";
import IconMI from "react-native-vector-icons/MaterialIcons";
import IconFA from "react-native-vector-icons/FontAwesome";

var Datastore = require("react-native-local-mongodb"),
  platedb = new Datastore({ filename: "plate", autoload: true });

// Represents a food item in a list of food
class FlatListItem extends Component {
  state = {
    grams: this.props.item.name[1],
    gramsInTransition: this.props.item.name[1],
    max: this.props.item.name[1] + 100,
    min: (this.props.item.name[1] <= 100) ? 0 : this.props.item.name[1] - 100,
    maximum: global.maximum, // The amount of space left available on the plate
    refresh: 0
  };
  // Update the amount of this particular food item in the plate array and the plate database
  updatePlate = sliderVal => {
    let newVal = this.updateValue(sliderVal);
    this.props.flatListParent.updateChild(newVal);
    this.props.flatListParent.setState({ refresh: 1});
    if(newVal <= 100){
      sliderMin = 0;
    }else{
      sliderMin = newVal - 100;
    }
    this.setState({ grams: newVal, min: sliderMin, max: newVal + 100, refresh: Math.random() });
    for (let i = 0; i < global.plate.length; i++) {
      if (
        global.plate[i]._id.toLowerCase() ==
        this.props.item.name[0].toLowerCase()
      ) {
        global.plate[i].amount = newVal;
      }
    }
    platedb.update(
      { _id: this.props.item.name[0].toLowerCase() },
      { $set: { amount: newVal } },
      {},
      function(err, numReplaced) {
        platedb.find({}, function(err, docs) {});
      }
    );
  };

  // Increase the amount of this food item by 1g
  plusButtonPressed = () => {
    var oldWeight = this.state.grams;
    var newWeight = oldWeight + 1;

    this.sliderChange(newWeight);
    this.updatePlate(newWeight);
  };

  // Decrease the amount of this food item by 1g
  minusButtonPressed = () => {
    var oldWeight = this.state.grams;
    var newWeight = oldWeight - 1;
    if (!(newWeight < 0)) {
      this.sliderChange(newWeight);
      this.updatePlate(newWeight);
    }
  };

  componentDidMount() {
    this.recalculateMaximum();
  }

  render() {
    var randomImages = {
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
    var group = this.props.item.name[2];
    return (
      <View style={styles.itemBackground}>
        <View style={styles.itemStyle}>
          <Image source={randomImages[group]} style={styles.image} />

          <Text style={styles.buttonView}>{this.props.item.name[0]}</Text>

          <TouchableOpacity
            style={styles.deleteView}
            onPress={() => this.deleteItem(this.props.item.name[0])}
          >
            <Text style={styles.deleteText}>
              <IconMI name="delete-forever" size={28} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sliderView}>
          <TouchableOpacity onPress={() => this.minusButtonPressed()}>
            <Text style={styles.minusText}>
              <IconFA name="minus-circle" size={22} />
            </Text>
          </TouchableOpacity>
          <Slider
            style={styles.slider}
            step={1}
            minimumValue={this.state.min}
            maximumValue={this.state.max}
            value={this.state.grams}
            onValueChange={val => this.sliderChange(val)}
            onSlidingComplete={val => this.updatePlate(val)}
          />
          <TouchableOpacity onPress={() => this.plusButtonPressed()}>
            <Text style={styles.plusText}>
              <IconFA name="plus-circle" size={22} />
            </Text>
          </TouchableOpacity>
          <Text style={styles.sliderText}>{this.state.grams}g</Text>
        </View>
      </View>
    );
  }
  // Upon moving the food amount slider, change the amount of this food on the plate and update and rerender
  // the pie chart to match.
  sliderChange = sliderVal => {
    let newVal = this.updateValue(sliderVal);
    this.setState({ grams: newVal });
    for (let i = 0; i < global.plate.length; i++) {
      if (
        global.plate[i]._id.toLowerCase() ==
        this.props.item.name[0].toLowerCase()
      ) {
        global.plate[i].amount = newVal;
      }
    }
    this.rerenderPie(Math.random());
    this.props.flatListParent.setState({ refresh: Math.random() });
  };

  updateValue = sliderVal => {
    if(sliderVal < 0){
      sliderVal = 0;
    }
    return sliderVal;
  }

  // Change one of the values present in the pie chart
  rerenderPie = newVal => {
    this.props.flatListParent.updateChild(newVal);
  };

  // Remove a food and its nutritional contribution from the plate
  deleteItem = foodName => {
    console.log("DELETE PRESSED");
    for (let i = 0; i < global.plate.length; i++) {
      if (global.plate[i]._id.toLowerCase() == foodName.toLowerCase()) {
        global.plate.splice(i, 1);
        var newVal = this.state.refresh + 1;
        this.setState({ refresh: newVal });
      }
    }
    platedb.remove({ _id: foodName.toLowerCase() }, function(err, numRemoved) {
      this.recalculateMaximum();
    });
    recalculateMaximum = () => {
      this.recalculateMaximum();
    };
    this.rerenderPie(Math.random());
    this.props.flatListParent.refreshFlatList();
    this.recalculateMaximum();
    this.setState({ grams: this.props.item.name[1] });
  };

  // Work out based on the food present, how much space is left on the plate (deprecated)
  recalculateMaximum = () => {
    global.maximum = 100;
    for (let i = 0; i < global.plate.length; i++) {
      global.maximum -= global.plate[i].amount;
    }
    this.setState({ maximum: global.maximum });
  };
}

updateState = rand => {
  this.setState({ rand });
};

export default class EditFoodScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Edit Food",
    headerLeft: (
      <Button
        title="Back"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    )
  });

  constructor(props) {
    super(props);
  }
  updateChild = rand => {
    updateState(rand);
  };

  state = {
    empty: "Your plate is empty! Add some by searching on the plate screen.",
    foods: [],
    refresh: 0
  };

  // Work out based on the food present, how much space is left on the plate (deprecated)
  recalculateMaximum = () => {
    global.maximum = 100;
    for (let i = 0; i < global.plate.length; i++) {
      global.maximum -= global.plate[i].amount;
    }
  };

  componentDidMount() {
    this.recalculateMaximum();
    console.log("Current items on Plate: ");
    console.log(global.plate);
    var length = global.plate.length;
    var allFoods = [];
    var maximumGrams = 100;
    for (i = 0; i < length; i++) {
      allFoods.push({
        name: [
          capitalizeFirstLetter(global.plate[i]._id),
          global.plate[i].amount,
          global.plate[i].group
        ]
      });
      maximumGrams -= global.plate[i].amount;
    }
    this.setState({ foods: allFoods });

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  // Ask the user if they wish to remove all food from their plate, if so then also update the plate database
  onClearClick = () => {
    Alert.alert(
      "Clear Plate",
      "Are you sure you want to delete all items on your plate?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            platedb.remove({}, { multi: true }, function(err, numRemoved) {
              deletePlate();
            });
          }
        }
      ],
      { cancelable: false }
    );
    deletePlate = () => {
      global.plate = [];
      this.setState({ foods: [] });
      global.maximum = 100;
      this.updateChild(Math.random());
    };
  };

  // Add or remove FlatListItem(s) of what's on the plate
  refreshFlatList = () => {
    var length = global.plate.length;
    var allFoods = [];
    var maximumGrams = 100;
    for (i = 0; i < length; i++) {
      allFoods.push({
        name: [
          capitalizeFirstLetter(global.plate[i]._id),
          global.plate[i].amount,
          global.plate[i].group
        ]
      });
      maximumGrams -= global.plate[i].amount;
    }
    this.setState({ foods: allFoods });

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  };

  render() {
    return (
      <View style={styles.bigContainer}>
        <View style={styles.scrollContainer}>
          <FlatList
            data={this.state.foods}
            extraData={this.state.refresh}
            renderItem={({ item, index }) => {
              return (
                <FlatListItem item={item} index={index} flatListParent={this} />
              );
            }}
            // Get key using allFoods unique foodname
            keyExtractor={(item) => item.name[0].toString()}
          />
        </View>
        <TouchableOpacity onPress={() => this.onClearClick()}>
          <Text style={styles.clearButton}>Clear Plate</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20
  },
  clearButton: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    justifyContent: "flex-end",
    marginBottom: 20
  },
  imageView: {
    flex: 1
  },
  buttonView: {
    width: "100%",
    marginLeft: 10,
    flexDirection: "column",
    flex: 1
  },
  itemStyle: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#c1c1c1",
    alignItems: "center"
  },
  image: {
    width: 30,
    height: 30,
    margin: 2
  },
  deleteView: {
    width: 45,
    height: 35,
    margin: 4,
    marginLeft: 12,
    borderRadius: 15,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  },
  deleteText: {
    color: "white",
    fontSize: 24
  },
  sliderView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a1a1a1"
  },
  slider: {
    flex: 7,
    marginLeft: 15
  },
  sliderText: {
    flex: 2,
    marginRight: 15,
    fontSize: 16,
    textAlign: "right"
  },
  itemBackground: {
    marginTop: 5
  },
  plusText: {
    marginLeft: 15,
    fontSize: 24
  },
  minusText: {
    marginLeft: 15,
    fontSize: 24
  }
});
