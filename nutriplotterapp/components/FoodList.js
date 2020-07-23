/*
	Consists of a search bar which matches the search string with all items in the food database, 
	and returns all matching foods in a flatlist.
	Also includes a recently added or "favourites" list when no search query is entered
*/

import React, { Component } from "react";
import {
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Alert
} from "react-native";
import { SearchBar } from "react-native-elements";

var Datastore = require("react-native-local-mongodb"),
db = new Datastore({ filename: "foods", autoload: true });
platedb = new Datastore({ filename: "plate", autoload: true });
favdb = new Datastore({ filename: "favourites", autoload: true });

class FlatListItem extends Component {
	state = { isSelected: false };
	

  render() {
		let isSelected = false;
		// If the food item in the FlatList is on the plate, it has been selected
    for (let i = 0; i < global.plate.length; i++) {
      if (global.plate[i].data.name == this.props.item.name.toLowerCase()) {
        isSelected = true;
      }
    }
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
		var group = this.props.item.group;
		
    return (
      <TouchableOpacity onPress={() => this.alertItemName(this.props.item)}>

				{/* Mark the item with a differented color iff it has been selected previously */}
        <View style={isSelected ? styles.itemStyleSelected : styles.itemStyle}>
          <Image source={foodImages[group]} style={styles.image} />
          <View style={styles.buttonView}>
            <View style={styles.container}>
              <Text>{this.props.item.name}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }


  alertItemName = item => {
    this.props.listParent.setState({ refresh: Math.random() });
    var isPlateIn = false;
    var newFoodId = item.name.toLowerCase();
    let index = 0;
    for (let i = 0; i < global.plate.length; i++) {
      if (item.name.toLowerCase() == global.plate[i]._id.toLowerCase()) {
        index = i;
        isPlateIn = true;
        break;
      }
    }
    if (!isPlateIn) {
      global.plate.push({
        _id: item.name,
        amount: 0,
        group: item.group,
        data: item.data
      });
      this.setState({ isSelected: true });
      console.log(newFoodId + " Inserted");
    } else {
      this.setState({ isSelected: false });
      global.plate.splice(index, 1);
      console.log(newFoodId + " Deleted");
    }

		// Search the plate table in the database for the given food; if not present, update its record otherwise 
		// remove.
    platedb.find({ _id: newFoodId }, function(err, newDocs) {
      if (newDocs.length == []) {
        platedb.update(
          { _id: newFoodId },
          { $set: { amount: 0, group: item.group, data: item.data } },
          { upsert: true },
          function(err, numReplaced, upsert) {}
        );
      } else {
        platedb.remove({ _id: newFoodId }, function(err, numRemoved) {
          console.log("Removed from DB!");
        });
      }
    });
		
		// Add to favourites
    let inDB = false;
    for (let i = 0; i < global.favourites.length; i++) {
      if (global.favourites[i]._id.toLowerCase() == newFoodId) {
        inDB = true;
      }
    }
    if (!inDB) {
			// If not in the database, put the food item at the start of the favourite food items list
      global.favourites.unshift({
        _id: item.name,
        amount: 0,
        group: item.group,
        data: item.data
      });
		}
		// Update the favourite foods database record for the current item
    favdb.update(
      { _id: newFoodId },
      { $set: { amount: 0, group: item.group, data: item.data } },
      { upsert: true },
      function(err, numReplaced, upsert) {}
    );
  };
}



// Represents the list of food items
class List extends Component {
  constructor(props) {
    super(props);
    updateStateHome = updateStateHome.bind(this);
  }
  state = {
    name: "",
    test: "",
    names: [],
    refresh: 0
  };

  componentDidMount() {
    this.showFavourites();
  }

  // Callback for entering text into the search bar
  onChangeText = name => {
    this.setState({ name });
    if (name.length > 2) {
      this.search(name);
    } else {
      this.showFavourites();
    }
  };

  render() {
    return (
      <View>
        <SearchBar
          onChangeText={this.onChangeText}
          style={styles.nameInput}
          placeholder="Enter a food"
          value={this.state.name}
          platform="default"
          lightTheme={true}
          containerStyle={styles.searchcontainer}
        />
        <View style={styles.scrollStyle}>
          <Text style={styles.checkDB}>{this.state.test}</Text>
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={this.state.names}
            renderItem={({ item, index }) => {
                return (<FlatListItem
                  listParent={this.props.listParent}
                  item={item}
                  index={index}
                />);
            }}
          />
        </View>
      </View>
    );
  }

  // Each food group a food item from the database can have corresponds to a category of food such as:
	// 	grains, sandwich, rice, pasta, pizza, bread, cereal, biscuits, cakes, pastries, pudding, savouries
	// milk, cream, cheese etc.
  determineGroup = input => {
    input = input.toLowerCase();
    var group = "";

    switch (input) {
      case "a":
      case "aa":
        group = "grains";
        break;
      case "ab":
        group = "sandwich";
        break;
      case "ac":
        group = "rice";
        break;
      case "ad":
        group = "pasta";
        break;
      case "ae":
        group = "pizza";
        break;
      case "af":
      case "ag":
        group = "bread";
        break;
      case "ak":
      case "ai":
        group = "cereals";
        break;
      case "am":
        group = "biscuits";
        break;
      case "an":
        group = "cakes";
        break;
      case "ao":
      case "ap":
        group = "pastries";
        break;
      case "as":
      case "br":
        group = "pudding";
        break;
      case "at":
      case "bv":
        group = "savouries";
        break;
      case "b":
      case "ba":
      case "bab":
      case "bae":
      case "bah":
      case "bak":
      case "ban":
      case "bar":
      case "bc":
      case "bf":
      case "bfd":
      case "bfg":
      case "bfj":
      case "bfp":
      case "bh":
      case "if":
      case "ifb":
      case "ifc":
        group = "milk";
        break;
      case "bj":
      case "bjc":
      case "bjf":
      case "bjl":
      case "bjp":
      case "bjs":
        group = "cream";
        break;
      case "bl":
        group = "cheese";
        break;
      case "bn":
      case "bne":
      case "bnh":
      case "bns":
        group = "cream";
        break;
      case "bp":
        group = "icecream";
        break;
      case "c":
      case "ca":
      case "cd":
      case "cde":
      case "cdh":
        group = "egg";
        break;
      case "da":
      case "dae":
      case "dam":
      case "dap":
      case "dar":
        group = "potato";
        break;
      case "df":
      case "db":
        group = "beans";
        break;
      case "d":
      case "dg":
      case "di":
        group = "veg";
        break;
      case "dr":
        group = "vegdish";
        break;
      case "f":
      case "fa":
        group = "fruit";
        break;
      case "fc":
      case "pe":
        group = "juice";
        break;
      case "ga":
      case "g":
        group = "nuts";
        break;
      case "h":
        group = "herbs";
        break;
      case "j":
      case "ja":
      case "jc":
      case "jk":
      case "jm":
      case "jr":
        group = "fish";
        break;
      case "maa":
      case "mag":
        group = "bacon";
        break;
      case "m":
      case "ma":
      case "mac":
      case "mai":
      case "mae":
      case "mig":
      case "mr":
      case "mi":
        group = "beef";
        break;
      case "mc":
      case "mca":
      case "mcc":
      case "mce":
      case "mcg":
      case "mci":
      case "mck":
      case "mcm":
      case "mco":
        group = "chicken";
        break;
      case "me":
      case "mea":
      case "mec":
      case "mee":
      case "meg":
        group = "game";
        break;
      case "mbg":
        group = "burger";
        break;
      case "o":
      case "oa":
      case "ob":
      case "oc":
      case "oe":
      case "of":
        group = "oil";
        break;
      case "p":
      case "pa":
      case "paa":
      case "pac":
      case "pc":
      case "pca":
      case "pcc":
        group = "drinks";
        break;
      case "q":
      case "qa":
      case "qc":
      case "qe":
      case "qf":
      case "qg":
      case "qi":
      case "qk":
        group = "booze";
        break;
      case "s":
      case "sc":
      case "se":
      case "sec":
        group = "sweets";
        break;
      case "sea":
        group = "chocolate";
        break;
      case "sn":
      case "sna":
      case "snb":
      case "snc":
        group = "snacks";
        break;
      case "wa":
      case "waa":
      case "wac":
      case "wae":
        group = "soup";
        break;
      case "wc":
      case "wcd":
      case "wcg":
      case "wcn":
        group = "sauce";
        break;
      case "wcg":
      case "we":
        group = "misc";
        break;
      default:
        group = "misc";
        break;
    }
    return group;
  };

	// Show all of the food items recorded as favourites (from the favourites table in the database)
  showFavourites = () => {
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var foods = [];
    var count = 0;
		

		// Collect all of the food items present in the favourites table of the database into a list of objects
		// to display. If food does not exist locally (i.e. hand-picked dataset), ignore it.
    for (let i = 0; i < global.favourites.length; i++) {
      try {
          let entry = global.favourites[i]._id.toLowerCase();
          var data = global.foods[entry];
          console.log(data);
          var formattedString = entry.replace(/['"]+/g, "");
          formattedString = capitalizeFirstLetter(formattedString);
          var group = this.determineGroup(data["group"].toLowerCase());
          foods.push({
            id: count,
            name: formattedString,
            group: group,
            data: data
          });
          count++;
		} catch (TypeError) {
            console.log("Food does not exist in database, has the DB been changed recently? (i.e. hand-picked dataset)");
        }
    }
    this.setState({
      test: "Recently Searched:",
      names: foods
    });
  };

	// Search the foods database for food items matching or involving the search query
  search = searchString => {
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleStateChange = (foodlen, searchlen, foods) => {};

    if (searchString.length > 0) {
      var regex = new RegExp(searchString.toLowerCase(), "g");
      var foods = []; // The food items we get matching the search term
      var count = 0;  // The number of `hits` our search term gets

      for (let i = 0; i < global.nameList.length; i++) {
        let entry = global.nameList[i];
        if (entry.search(regex) != -1) {
          var data = global.foods[entry];
          var formattedString = entry.replace(/['"]+/g, "");
          formattedString = capitalizeFirstLetter(formattedString);
          var group = this.determineGroup(data.group.toLowerCase());
          foods.push({
            id: count,
            name: formattedString,
            group: group,
            data: data
          });
          count++;
        }
			}
			
      if (count > 0 || searchString.length == 0) {
        this.setState({
          test: "",
          names: foods
        });
      } else {
        this.setState({
          test: "No foods found matching that criteria, please try again using single word queries (e.g. bread) and scrolling through the list",
          names: foods
        });
      }
		} else {
			// Report any errors/food items found as a result of the search
			this.setState({
				test: '',
				names: []
			})
		}
    

  };
} export default List;


const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    justifyContent: "center"
  },
  text: {
    color: "#4f603c"
  },
  scrollStyle: {
    height: "80%"
  },
  checkDB: {
    textAlign: "center",
    color: "red"
  },
  nameInput: {
    height: "15%",
    marginHorizontal: "6%",
    marginVertical: 5,
    paddingHorizontal: "5%",
    borderColor: "#000",
    borderWidth: 1
  },
  searchcontainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent"
  },
  imageView: {
    flex: 1
  },
  buttonView: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "column"
  },
  itemStyle: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    marginTop: 3,
    alignItems: "flex-start",
    backgroundColor: "#c1c1c1",
    justifyContent: "center"
  },
  itemStyleSelected: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    marginTop: 3,
    alignItems: "flex-start",
    backgroundColor: "yellow",
    justifyContent: "center"
  },
  image: {
    width: 30,
    height: 30,
    margin: 2
  }
});
