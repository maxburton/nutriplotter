import { StyleSheet } from 'react-native';
import styleMap from "../themes/globalStyles";

const offset = styleMap.constants.offset;
const width = styleMap.constants.width;
const height = styleMap.constants.height;

// amber colour = #f4b342

const styles = StyleSheet.create({
	footer: {
		marginTop: offset,
		marginBottom: offset,
		fontSize: 16,
		textAlign: "center",
	},
	textAdjustments: {
		flex: 1,
		marginTop: offset,
		marginBottom: offset,
		fontSize: offset,
		textAlign: "center",
		marginLeft: offset,
		marginRight: offset,
	},

	textColMid: {
		textAlign: "center",
		marginRight: offset,
		marginLeft: offset,
	},
	textColRight: {
		flex: 1,
		textAlign: "right",
		marginRight: offset,
	},
	colHeader: {
		marginTop: offset,
		fontSize: offset - 2,
		fontWeight: 'bold',
	},
	colHeaderLeft: {
		textAlign: "left",
		marginLeft: offset,
	},
	colHeaderMid: {
		textAlign: "center",
		marginLeft: offset,
		marginRight: offset,
	},
	colHeaderRight: {
		flex: 1,
		textAlign: "right",
		marginRight: offset,
	},
});


export default styles;