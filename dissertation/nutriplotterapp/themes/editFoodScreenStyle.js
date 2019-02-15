import {StyleSheet} from 'react-native';


const styles = StyleSheet.create ({
    container: {
       flex: 1,
       marginTop: 100,
       alignItems: 'center',
       justifyContent: 'space-around',
    },
    scrollContainer: {
       flex: 3,
       marginTop: 50,
    },
    clearButton:{
      textAlign: 'center',
      fontSize: 18,
      color: 'red',
      justifyContent: 'flex-end',
     },
});

export default styles;