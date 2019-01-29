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

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  onValueChange = (value) => {
    this.setState({switchValue: value})
    setStateSwitch(value)
    console.log('Switch 1 is: ' + value)
  }
  constructor() {
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {switch1State};
  }

  render() {
    const isDarkMode = this.state.switchValue;
    if (isDarkMode){
      style={flex:1, backgroundColor: '#191919'}
      backgroundColor='#4C4C4C'
      titleStyle={color: '#FFFFFF'}
    } else {
      style={flex:1, backgroundColor: '#FFFFFF'}
      backgroundColor='#FFFFFF'
      titleStyle={color: '#000000'}
    }
    return (
      <View isDarkMode={isDarkMode} style={style}>
        <SettingsList>
          <SettingsList.Item
            backgroundColor={backgroundColor}
            hasNavArrow={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasSwitch={true}
            title='Dark Background'
            titleStyle={titleStyle}
            />
          </SettingsList>
      </View>
    );
  }
}


