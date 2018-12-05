import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Switch,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import SettingsList from 'react-native-settings-list';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
//  onValueChange = (value) => {
//    this.setState({switchValue: value})
//    console.log('Switch 1 is: ' + value)
//  }
  toggleSwitch = (switchNumber) => {
    this.setState({
      activeSwitch: switchNumber === this.state.activeSwitch ? null : switchNumber
    })
  };
  switchOne = (value) => { this.toggleSwitch(1) };
  switchTwo = (value) => { this.toggleSwitch(2) };
  switchThree = (value) => { this.toggleSwitch(3) };
  switchFour = (value) => { this.toggleSwitch(4) };
  constructor() {
    super();
//    this.onValueChange = this.onValueChange.bind(this);
    this.state = {//switchValue: false
      activeSwitch: null,
    };
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View>
        <SettingsList>
          <SettingsList.Item
            hasNavArrow={false}
            switchState={this.state.activeSwitch === 1}
            switchOnValueChange={this.switchOne}
            hasSwitch={true}
            title='Setting 1'/>

          <SettingsList.Item
            hasNavArrow={false}
            switchState={this.state.activeSwitch === 2}
            switchOnValueChange={this.switchTwo}
            hasSwitch={true}
            title='Setting 2'/>

          <SettingsList.Item
            hasNavArrow={false}
            switchState={this.state.activeSwitch === 3}
            switchOnValueChange={this.switchThree}
            hasSwitch={true}
            title='Setting 3'/>
            
          <SettingsList.Item
            hasNavArrow={false}
            switchState={this.state.activeSwitch === 4}
            switchOnValueChange={this.switchFour}
            hasSwitch={true}
            title='Setting 4'/>
        </SettingsList>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
     flex: 1,
     marginTop: 100
  }
})
