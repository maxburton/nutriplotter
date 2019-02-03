import {StyleSheet} from 'react-native';

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

export default styles;