import React from 'react';
import {
  Switch,
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import SettingsList from 'react-native-settings-list';

export default class EditFoodScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Edit Food',
	headerLeft: <Button title='Back' onPress={() => {navigation.navigate('Home')}} />,

  });
  render() {
    return (
      <View style={styles.container}>
        <Text>Edit some food</Text>
		<Button title="Go to Home screen"
		onPress={() => this.props.navigation.navigate('Home')}
	   />
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
     flex: 1,
     marginTop: 100,
	 alignItems: 'center',
	 justifyContent: 'space-around',
  }
})
