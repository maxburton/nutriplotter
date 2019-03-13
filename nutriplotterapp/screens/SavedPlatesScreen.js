/*
	Shows the user's saved plates (as well as a few default plates). These plates can be loaded into the homescreen.
*/

import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Switch,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import SettingsList from 'react-native-settings-list';
import index from '../themes';
import getStyleSheet from '../themes/style';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  onValueChange = (value) => {
    this.setState({switchValue: value})
    setStateSwitch(value)
    console.log('Switch 1 is: ' + value)
  }
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      switch1State,
      darkTheme: false
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }
  toggleTheme() {
    this.setState({darkTheme: !this.state.darkTheme})
  };

  render() {
    const styles = getStyleSheet(this.state.darkTheme);
    /*const isDarkMode = this.state.switchValue;
    if (isDarkMode){
      style={flex:1, backgroundColor: '#191919'}
      backgroundColor='#4C4C4C'
      titleStyle={color: '#FFFFFF'}
    } else {
      style={flex:1, backgroundColor: '#FFFFFF'}
      backgroundColor='#FFFFFF'
      titleStyle={color: '#000000'}
    }*/
    return (
      <View /*isDarkMode={isDarkMode}*/ style={styles.container}>
        <SettingsList>
          <SettingsList.Item 
            backgroundColor={styles.settingsList.backgroundColor}
            hasNavArrow={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasSwitch={true}
            title='Dark Background'
            //titleStyle={styles.settingsList.titleStyle}
            />
          </SettingsList>
      </View>
    );
  }
}
