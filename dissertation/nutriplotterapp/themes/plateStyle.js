import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
       padding: 10,
       marginTop: 3,
       alignItems: 'center',
       backgroundColor: '#a1a1a1',
    },
    viewContainer:{
     flex:1,
     margin: '10%'
    },
    plate: {
     flex:1,
     alignItems: 'center',
     justifyContent: 'space-around',
    },
    text: {
       color: '#4f603c'
    },
    scrollStyle: {
       height: '70%',  
    },
      checkDB: {
       textAlign: 'center',
       color: 'red',
    },
      nameInput: {
      height: '15%',
      margin: '5%',
      paddingHorizontal: '5%',
      borderColor: '#111111',
      borderWidth: 1,
   },
   image: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     width: null,
     height: null,
     resizeMode: 'contain'
   },
});

export default styles;