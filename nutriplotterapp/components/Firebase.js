import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyDDEJNntQAHQO4K09I2lBaCTVYlq1i6eDo",
  authDomain: "nutriplotter.firebaseapp.com",
  databaseURL: "https://nutriplotter.firebaseio.com",
  projectId: "nutriplotter",
  storageBucket: "nutriplotter.appspot.com"
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
