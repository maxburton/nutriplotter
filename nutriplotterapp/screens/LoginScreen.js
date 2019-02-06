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

const styles = StyleSheet.create({
  button: {
    width: "50%",
    borderRadius: 4,
    padding: 24,
    borderRadius: 8,
    alignSelf: "center",
    backgroundColor: "#00d0ff"
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
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: "transparent"
  },
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