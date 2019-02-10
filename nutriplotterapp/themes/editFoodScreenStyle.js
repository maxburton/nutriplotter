import {StyleSheet} from 'react-native';

/* Try to separate concerns of the styling from the screen/component
   source files. Ideally import the pertinent style as in
      import {styles} from '../themes/{component/screen-name}'
*/
const styles = StyleSheet.create ({
   bigContainer: {
      flex: 1,
      marginTop: 35,
   },
   scrollContainer: {
      flex: 1,
      marginTop: 10,
     justifyContent: 'flex-start',
   },
   clearButton:{
      textAlign: 'center',
      fontSize: 18,
      color: 'red',
      justifyContent: 'flex-end',
      marginBottom: 30,
      marginTop: 30,
   },
   imageView: {
      flex: 1,
   },
   buttonView: {
      width: '100%',
      marginLeft: 10,
      flexDirection: 'column',
      flex: 1,
   },
   itemStyle: {
      flex: 1,  
      flexDirection: 'row',
      padding: 8,
      marginTop: 3,
      alignItems: 'flex-start',
      backgroundColor: '#c1c1c1',
   },
   image: {
      width: 30,
      height: 30,
      margin: 2,
   },
   deleteView: {
      width: 45,
      height: 35,
      margin: 4,
      marginLeft: 12,
      borderRadius: 15,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
   },
   deleteText: {
      color: 'white',
      fontSize: 24,
   }
});

export default styles;