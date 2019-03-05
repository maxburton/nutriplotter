import React, { Component } from "react";
import {
  Switch,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Slider
} from "react-native";
import { WebBrowser } from "expo";
import IconMI from "react-native-vector-icons/MaterialIcons";
import IconFA from "react-native-vector-icons/FontAwesome";
import Plate from "../components/Plate";
import getStyleSheet from "../themes/style";

var Datastore = require("react-native-local-mongodb"),
  platedb = new Datastore({ filename: "plate", autoload: true });


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


class FlatListItem extends Component {
  state = {
    grams: this.props.item.name[1],
    maximum: 500,
    refresh: 0
  };

  updatePlate = val => {
    platedb.update(
      { _id: this.props.item.name[0].toLowerCase() },
      { $set: { amount: val } },
      {},
      function(err, numReplaced) {
        console.log(numReplaced);
        platedb.find({}, function(err, docs) {
          console.log(docs);
        });
      }
    );
  };
  plusButtonPressed = () => {
    var oldWeight = this.state.grams;
    var newWeight = oldWeight + 1;
    if (!(newWeight > 500)) {
      this.setState({ grams: newWeight });
      this.updatePlate(newWeight);
    }
  };

  minusButtonPressed = () => {
    var oldWeight = this.state.grams;
    var newWeight = oldWeight - 1;
    if (!(newWeight < 0)) {
      this.setState({ grams: newWeight });
      this.updatePlate(newWeight);
    }
  };

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

    console.log(this.plate);

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
            minimumValue={0}
            maximumValue={this.state.maximum}
            value={this.state.grams}
            onValueChange={val => this.setState({ grams: val })}
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

  deleteItem = foodName => {
    platedb.remove({ _id: foodName.toLowerCase() }, function(err, numRemoved) {
      refresh();
    });
    refresh = () => {
      var newVal = this.state.refresh + 1;
      this.setState({ refresh: newVal });
    };
  };
}

export default class EditFoodScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Edit Food",
    headerLeft: (
      <Button
        title="Back"
        onPress={() => {
          console.log(this.plate);
          navigation.navigate("Home", {
            foods: navigation.getParam("foods", []), //this.state.foods,
            score: navigation.getParam("score", defaultScore)
          });
        }}
      />
    )
  });

  state = {
    empty: "Your plate is empty! Add some by searching on the plate screen.",
    promiseIsResolved: false,
    foods: [],
    score: {}
  };

  constructor(props) {
    super(props);
    this.state.foods = props.foods;
    console.log(this.state.foods);
    this.state.score = props.score;
  }

  componentDidMount() {
    setPromiseToResolved = () => {
      this.setState({ promiseIsResolved: true });
    };

    setFoodsState = allFoods => {
      this.setState({ foods: allFoods });
    };

    platedb.find({}, function(err, docs) {
      console.log("Current items on Plate: ");
      console.log(docs);
      setPromiseToResolved();
      var length = docs.length;
      console.log(length);
      var allFoods = [];
      var maximumGrams = 500;
      for (i = 0; i < length; i++) {
        allFoods.push({
          name: [
            capitalizeFirstLetter(docs[i]._id),
            docs[i].amount,
            docs[i].group
          ]
        });
        maximumGrams -= docs[i].amount;
      }
      setFoodsState(allFoods);
    });

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

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
      this.setState({ foods: [] });
    };
  };

  render() {
    this.state.foods = this.props.navigation.getParam("foods", []);
    this.state.score = this.props.navigation.getParam("score", {
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
    });

    // Each time this screen is loaded, we create a new plate from the previous one's properties
    this.plate = new Plate({
      style: getStyleSheet(false),
      score: this.state.score,
      foods: this.state.foods
    });

    console.log(this.state.foods);

    if (!this.state.promiseIsResolved) {
      return null;
    }

    return (
      <View style={styles.bigContainer}>
        <View style={styles.scrollContainer}>
          <FlatList
            data={this.state.foods}
            renderItem={({ item, index }) => {
              return <FlatListItem item={item} index={index} />;
            }}
          />
        </View>
        <TouchableOpacity onPress={this.onClearClick}>
          <Text style={styles.clearButton}>Clear Plate</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

EditFoodScreen.defaultProps = {
  plate: null,
  foods: [],
  score: {}
};

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "flex-start"
  },
  clearButton: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    justifyContent: "flex-end",
    marginBottom: 30,
    marginTop: 30
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
