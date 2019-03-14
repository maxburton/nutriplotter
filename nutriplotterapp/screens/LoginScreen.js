/*
  Prompts the user to login via Facebook, then takes them to their user page. From here they can navigate 
  to the leaderboard screen or logout. 
*/

import { ExpoConfigView } from "@expo/samples";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { SocialIcon } from "react-native-elements";
import Timeline from "react-native-timeline-listview";
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from "../components/Firebase.js";

import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  ScrollView,
  Image
} from "react-native";
import * as Expo from "expo";

const id = "2301384936810927";

const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken } = FBSDK;

// isLoggedIn represents a string of the username (according to the Facebook SDK) of the logged in user.
global.isLoggedIn = null;

export default class LoginScreen extends Component {
  static navigationOptions = () => ({
    title: "My Profile"
  });

  // Handle any Component props as they are defined in React
  constructor(props) {
    super(props);
  }

  // Attempt a login to facebook using the app id, requesting permissions to read the user profile and email address.
  login = async () => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      id,
      {
        permissions: ["public_profile", "email"]
      }
    );

    if (type == "success") {
      // If we've managed to login successfully, grab the profile picture as part of the response for the ProfileScreen
      response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`
      );

      global.userinfo = await response.json();

      // Retrieve the requested user profile info from the AJAX response
      const id = userinfo["id"];
      const name = userinfo["name"];
      const userpic = userinfo["picture"]["data"]["url"];

      // Update (or write if not present) the user profile information stored on the Firebase database.
      firebase
        .database()
        .ref("users/" + id)
        .set({
          username: name,
          profile_picture: userpic
        });

      // Redirect to profile screen
      this.props.navigation.navigate("ProfileScreen");
      global.isLoggedIn = name;

      // If login was successful then we rerender the screen to show the relevant ProfileScreen, else just show
      // the LoginScreen again.
      this.forceUpdate();
    } else {
      // Indicate the error to the user if they couldn't login.
      alert(type);
    }
  };

  logout = (async = () => {
    // Reset the logged in username as null when logged out (this may be used as a measure to check if a user is logged in)
    global.isLoggedIn = null;
    // On logout, force the screen to rerender as LoginScreen
    this.forceUpdate();
  });

  render() {
    if (global.isLoggedIn) {
      const url = userinfo["picture"]["data"]["url"];
      const { navigate } = this.props.navigation;

      // ProfileScreen's visible form:
      return (
        <ScrollView style={styles.container}>
          <View style={styles.header} />
          <Image style={styles.avatar} source={{ uri: url }} />
          <View style={styles.body}>
            <Text style={styles.name}>{userinfo["name"]}</Text>
            <Text style={styles.info}>Glasgow, Scotland</Text>
            <View style={styles.bodyContent}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigate("LeaderboardScreen")}
              >
                <Text>Leaderboards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logout}
                onPress={this.logout}
              >
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    } else {
      const { navigate } = this.props.navigation;

      // If we're not logged in, display a login button
      return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginScreenContainer}>
              <View style={styles.loginFormView}>
                <Text style={styles.logoText}>NutriPlotter</Text>

                <SocialIcon
                  title="Login with Facebook"
                  button
                  type="facebook"
                  onPress={this.login}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    width: "50%",
    borderRadius: 4,
    padding: 24,
    borderRadius: 8,
    alignSelf: "center",
    backgroundColor: "#00d0ff"
  },
  logout: {
    marginTop: 30
  },
  containerView: {
    flex: 1
  },
  loginScreenContainer: {
    flex: 1
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: "center"
  },
  loginFormView: {
    flex: 1
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5
  },
  loginButton: {
    backgroundColor: "#3897f1",
    borderRadius: 5,
    height: 45,
    marginTop: 10
  },
  fbLoginButton: {},
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
  userstats: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "600",
    textAlign: "center"
  },
  body: {
    marginTop: 40,
    justifyContent: "center"
  },
  bodyContent: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    padding: 30
  },
  name: {
    fontSize: 28,
    marginTop: 40,
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
    textAlign: "center",
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
