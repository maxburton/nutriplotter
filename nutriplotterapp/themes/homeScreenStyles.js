import {StyleSheet} from 'react-native';
import styleMap from "../themes/globalStyles";

const offset = styleMap.constants.offset;
const width = styleMap.constants.width;
const height = styleMap.constants.height;

const styles = StyleSheet.create({
  plateView: {
    flex: 1,
    marginTop: "10%"
  },
  UL: {
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  DL: {
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  UR: {
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  DR: {
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
});


export default styles;