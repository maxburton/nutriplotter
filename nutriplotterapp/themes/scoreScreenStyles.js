import { StyleSheet } from 'react-native';
import styleMap from "../themes/globalStyles";

const offset = styleMap.constants.offset;
const width = styleMap.constants.width;
const height = styleMap.constants.height;

// amber colour = #f4b342

const styles = StyleSheet.create({
	row: {
		flex: 1,
		flexDirection: 'row'
	},
	column: {
		flexDirection: 'column'
	},
	columnRight: {
		flex: 1,
		flexDirection: 'column'
	},
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
	textCol: {
		marginTop: offset,
		fontSize: offset - 2,
	},
	textColLeft: {
		textAlign: "left",
		marginLeft: offset,
		textDecorationLine: 'underline',
		textDecorationStyle: 'dotted'
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
	textGreen: {
		color: "green",
	},
	textRed: {
		color: "red",
	},
	textGrey: {
		color: "gray",
	},
	textBlue: {
		color: "blue",
	},
	buttonText: {
		flex: 1,
		marginTop: "3%",
		fontSize: 24,
		marginBottom: "3%",
		color: "blue",
		textAlign: "center",
	},
});


export default styles;