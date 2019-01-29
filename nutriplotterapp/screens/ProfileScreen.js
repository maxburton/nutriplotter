//UNUSED LEGACY

import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import "./LoginScreen.js";
import Timeline from "react-native-timeline-listview";

import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";

import StatsScreen from "../screens/StatsScreen";

/*const statsStack = createStackNavigator({
  Stats: { screen: StatsScreen }
}); */

console.log();
export default class ProfileScreen extends Component {
  static navigationOptions = {
    title: "My Profile"
  };

  constructor() {
    super();
    this.data = [
      {
        time: "🥇",
        title: "Points",
        description: "You have earned a total of 890 points"
      },
      {
        time: "🍽️",
        title: "Plates",
        description: "You've made a total of 69 plates"
      },
      {
        time: "🏆",
        title: "Score",
        description: "Your overrall score is 65"
      }
    ];
  }

  render() {
    const url = userinfo["picture"]["data"]["url"];
    const { navigate } = this.props.navigation;

    return (
      <ScrollView>
        <View style={styles.header} />

        <Image style={styles.avatar} source={{ uri: url }} />
        <View style={styles.body}>
          <Text style={styles.name}>{userinfo["name"]}</Text>
          <Text style={styles.info}>Glasgow, Scotland</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum
            electram expetendis, omittam deseruisse consequuntur ius an,
          </Text>
          <Text style={styles.userstats}>User Stats</Text>
          <View style={styles.container}>
            <Timeline style={styles.list} data={this.data} />
          </View>
          <Text style={styles.favouritefoods}>Your Favourite Foods</Text>
          <View style={styles.grid}>
            <Image
              style={styles.icon}
              source={require("../assets/images/apple.png")}
            />
            <Image
              style={styles.icon}
              source={require("../assets/images/meat.png")}
            />
            <Image
              style={styles.icon}
              source={require("../assets/images/banana.png")}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

//code for text that is not needed
/* <Text style={styles.name}>John Doe</Text>
            <Text style={styles.info}>UX Designer / Mobile developer</Text>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum
              electram expetendis, omittam deseruisse consequuntur ius an,
            </Text>
*/

//code for buttons that are not needed just now

/* <TouchableOpacity style={styles.buttonContainer}>
<Text>Shopping List</Text>
</TouchableOpacity>
<TouchableOpacity
style={styles.buttonContainer}
onPress={() => navigate("Stats")}
>
<Text>User Stats</Text>
</TouchableOpacity> */

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 200
  },
  icon: {
    flex: 1,
    width: 120,
    height: 120,
    alignSelf: "center",
    borderColor: "black",
    resizeMode: "contain"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130
  },
  //name: {
  // fontSize: 22,
  //color: "#FFFFFF",
  // fontWeight: "600"
  //},
  userstats: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "600",
    textAlign: "center"
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    marginTop: 40,
    flex: 1,
    textAlign: "center",
    padding: 30
  },
  name: {
    fontSize: 28,
    marginTop: 40,
    //color: "#696969",
    textAlign: "center",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    textAlign: "center",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    //color: "#696969",
    marginTop: 10,
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF"
  },
  stage: {
    backgroundColor: "#EFEFF4",
    paddingTop: 20,
    paddingBottom: 20
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10
  },
  list: {
    flex: 1,
    marginTop: 10
  },
  favouritefoods: {
    fontSize: 20,
    padding: 10,
    fontWeight: "600",
    textAlign: "center"
  },
  grid: {
    flexDirection: "row"
  }
});
