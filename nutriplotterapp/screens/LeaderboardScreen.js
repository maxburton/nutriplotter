import * as React from "react";
import { Constants, WebBrowser } from "expo";
import firebase from "../components/Firebase.js";
import Leaderboard from "react-native-leaderboard";

import {
  Linking,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button
} from "react-native";
import { MonoText } from "../components/StyledText";
import getStyleSheet from "../themes/style";

export default class LeaderboardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Leaderboards",
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

        //organised
        //console.log(data);
        //this.setState({ data: data });
      });
  };

  render() {
    if (!this.state.promiseIsResolved) {
      return (
        <View>
          <Text>waiting on leaderboards..</Text>
        </View>
      );
    } else {
      return (
        <Leaderboard data={global.data} sortBy="highScore" labelBy="userName" />
      );
    }
  }
}
