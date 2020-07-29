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
    backgroundContainer: {
     position: 'absolute',
     top: 0,
     bottom: 0,
     left: 0,
     right: 0,
    },
    plate: {
     flex:1,
     alignItems: 'center',
     justifyContent: 'space-around',
    },
    plateImage: {
     zIndex: 2,
     height: 200,
     width: 200,
    },
    pieChart: {
     height: 200,
     width: 200,
    zIndex: 3,     
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
   backButton: {
	 fontSize: 20,
	 textAlign: "center",
	 marginVertical: 10,
	 color: "blue",
   }
});

export default styles;