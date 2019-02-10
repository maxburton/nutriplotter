import { ExpoConfigView } from "@expo/samples";
import React, { Component } from "react";
import Timeline from "react-native-timeline-listview";
import { createStackNavigator, createAppContainer } from "react-navigation";

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
  Image,
} from "react-native";
import * as Expo from "expo";


import styles from '../themes/loginScreenStyle';


const id = "2301384936810927";

export default class LoginScreen extends Component {
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

  login = async () => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      id,
      {
        permissions: ["public_profile", "email"]
      }
    );

    if (type == "success") {
      response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`
      );

      //storing respose as json
      global.userinfo = await response.json();

      console.log("USER_INFO", userinfo);

      //redirect to profile screen
      this.props.navigation.navigate("ProfileScreen");//
	  console.log(global.isLoggedIn);
	  global.isLoggedIn = true;
	  this.forceUpdate()
	  console.log(global.isLoggedIn);
    } else {
      alert(type);
    }
  };

  render() {
	if(global.isLoggedIn){
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
	}else{
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
              <Text style={styles.logoText}>NutriPlotter</Text>
              <TextInput
                placeholder="Username"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
              />
              <TextInput
                placeholder="Password"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                secureTextEntry={true}
              />
              <Button
                style={styles.loginButton}
                onPress={() => this.props.navigation.navigate("ProfileScreen")}
                title="Login"
              />
              <Button
                style={styles.fbLoginButton}
                onPress={() => this.login()}
                title="Login with Facebook"
                color="#3897f1"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
	}
  }
}