/*
	Tells the user how to play the game, as well as providing a link to choosemyplate.gov
*/

import * as React from 'react';
import TutorialCarousel from "../components/TutorialCarousel.js"
import { View} from 'react-native';


export default class HelpScreen extends React.Component {
  static navigationOptions = () => ({
    title: "How to Play",
    headerStyle: { backgroundColor: global.colorTheme.navHeader.backgroundColor },
		headerTintColor: global.colorTheme.navHeader.color
	});

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", this.refresh);
  }

  refresh = () => {
    this.setState({ refresh: Math.random() });
    // refresh header
    this.props.navigation.setParams({});
  }

  render() {
    return (
      <View style={[global.styles.flex1, global.colorTheme.bgColor]}>
        < TutorialCarousel />
      </View>
    )
  }
}
