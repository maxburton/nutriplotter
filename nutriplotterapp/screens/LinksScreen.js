/*
	Tells the user how to play the game, as well as providing a link to choosemyplate.gov
*/

import * as React from 'react';
import TutorialCarousel from "../components/TutorialCarousel.js"
import { View} from 'react-native';


export default class HelpScreen extends React.Component {
  static navigationOptions = {
    title: "How to Play",
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={global.styles.flex1}>
        < TutorialCarousel />
      </View>
    )
  }
}
