/*
	Displays all logged in user's score rankings.
*/

import * as React from "react";
import firebase from "../components/Firebase.js";
import Leaderboard from "react-native-leaderboard";

import { Linking, Text, View, Button, StyleSheet } from "react-native";

export default class LeaderboardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Global Leaderboard",
    headerLeft: (
      
      <Button
        title="Back"
        onPress={() => {
          navigation.navigate("Login");
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = { promiseIsResolved: false };
  }

  componentDidMount() {
    this.readUserData();
  }

  // Retrieve the user scores from the database
  readUserData = async () => {
    self = this;
    firebase
      .database()
      .ref("scores/")
      .on("value", function(snapshot) {
        var returnArr = [];
        global.data = [];
        global.orgDict = {};

        snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          item.key = childSnapshot.key;

          returnArr.push(item);
        });

        console.log(returnArr);
        for (var i = 0; i < returnArr.length; i++) {
          data.push({
            userName: returnArr[i]["key"],
            highScore: returnArr[i]["userscore"]
          });
          orgDict[returnArr[i]["key"]] = returnArr[i]["userscore"];
        }

        self.setState({ promiseIsResolved: true });
      });
  };

  render() {
    if (!this.state.promiseIsResolved) {
      // We're still waiting on that async call (readUserData) to resolve so let the user know the data
      // is still being retrieved.
      return (
        <View>
          <Text>waiting on leaderboards..</Text>
        </View>
      );
    } else {
      // readUserData resolved so display a leaderboard with the data
      return (
        <Leaderboard data={global.data} sortBy="highScore" labelBy="userName" />
      );
    }
  }
}
