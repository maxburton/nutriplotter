import { ExpoConfigView } from "@expo/samples";
import React, { Component } from "react";
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Button
} from "react-native";
import Expo from "expo";

const id = "2301384936810927";

export default class ProfileScreen extends Component {
  static navigationOptions = {
    title: "My Profile"
  };

  login = async () => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      id,
      { permissions: ["public_profile", "email", "user_friends"] }
    );

    if (type == "success") {
      response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,name,birthday,picture`
      );

      //storing respose as json
      console.log("response", response);
      const json = await response.json();
      console.log("USER_INFO", json);

      global.userinfo = json;

      //redirect to profile screen
      this.props.navigation.navigate("ProfileScreen");
    } else {
      alert(type);
    }
  };

  render() {
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
  }
});
