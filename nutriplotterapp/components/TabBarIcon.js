import React from 'react';
import * as Icon from '@expo/vector-icons';

import Colors from '../constants/Colors';

/* Used to provide a component for tab icons which change appearance when selected */
export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}