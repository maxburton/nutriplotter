// Global styles

import { StyleSheet, Dimensions } from 'react-native';

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const offset = 24;
const constants = {
    "offset": offset,
    "blue": "#0091ff",
    "red": "red",
    "grey": "grey",
    "green": "green",
    "white": "white",
    "black": "black",
    "darkGrey": "#232323",
    "lightGrey": "#f3f3f3",
    "lighterDarkGrey": "#434343",
    "lighterGrey": "#fbfbfb",
    "width": width,
    "height": height,
}

const globalStyles = StyleSheet.create({

    // flex
    flex1: {
        flex: 1
    },
    flex7: {
        flex: 7
    },
    flexCol: {
        flexDirection: "column"
    },
    flexRow: {
        flexDirection: "row",
    },
    flexCenter: {
        alignItems: "center",
        justifyContent: "center"
    },
    flexEnd: {
        alignContent: "flex-end",
        justifyContent: "flex-end"
    },
    flexStart: {
        alignContent: "flex-start",
        justifyContent: "flex-start"
    },

    //margins
    marginFromTop: {
        marginTop: constants.offset,
    },
    marginFromBottom: {
        marginBottom: constants.offset,
    },
    marginFromLeft: {
        marginLeft: constants.offset,
    },
    marginFromRight: {
        marginRight: constants.offset,
    },
    marginFromTopHalf: {
        marginTop: constants.offset/2,
    },
    marginFromBottomHalf: {
        marginBottom: constants.offset/2,
    },
    marginFromLeftHalf: {
        marginLeft: constants.offset/2,
    },
    marginFromRightHalf: {
        marginRight: constants.offset/2,
    },

    //padding
    paddingFromTop: {
        paddingTop: constants.offset,
    },
    paddingFromBottom: {
        paddingBottom: constants.offset,
    },
    paddingFromLeft: {
        paddingLeft: constants.offset,
    },
    paddingFromRight: {
        paddingRight: constants.offset,
    },

    //text
    textCenter: {
        textAlign: 'center'
    },
    textLeft: {
        textAlign: 'left'
    },
    textRight: {
        textAlign: 'right'
    },
    textBig: {
        fontSize: 24,
    },
    textBigMed: {
        fontSize: 18,
    },
    textMed: {
        fontSize: 14,
    },
    textSmall: {
        fontSize: 12,
    },
    textDotted: {
        textDecorationLine: 'underline',
		textDecorationStyle: 'dotted'
    },
    textBold: {
        fontWeight: 'bold',
    },

    // Headers and Footers
    header: {
		marginTop: constants.offset * 2,
		marginBottom: constants.offset,
		fontSize: offset,
		textAlign: "center",
    },
    header2: {
		marginTop: constants.offset,
		marginBottom: constants.offset,
		marginLeft: constants.offset,
		fontSize: offset - 6,
		textAlign: "left",
    },
    imageWide: {
        width: "100%",
        height: 64
    },

    // Components
    button: {
        alignItems: "center",
        margin: 5,
        marginLeft: "15%",
        marginRight: "15%",
        borderRadius: 20,
    },
    buttonText: {
        textAlign: "center",
        margin: 5,
        fontSize: 24,
    },
    modalContainer: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		borderRadius: constants.offset/2,
		borderColor: "gray",
		borderWidth: 2,
		marginTop: "30%",
		marginBottom: "30%",
		marginLeft: -constants.offset/2,
		marginRight: -constants.offset/2,
    },
    carouselContainer: {
		flex: 1,
		backgroundColor: constants.white,
		borderRadius: constants.offset/2,
		marginTop: constants.offset,
		marginBottom: constants.offset,
		marginLeft: constants.offset,
		marginRight: constants.offset,
    },
    carouselDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
    },
	backButton: {
		backgroundColor: constants.white,
		borderRadius: constants.offset/2,
		borderBottomWidth: 2,
		borderColor: "gray",
	},
	backButtonText: {
		fontSize: 18,
		textAlign: "left",
		marginTop: constants.offset,
		marginBottom: constants.offset,
		marginLeft: constants.offset
	},

    // colours
    blue: {
        color: constants.blue,
    },
    red: {
        color: constants.red,
    },
    green: {
        color: constants.green,
    },
    grey: {
        color: constants.grey,
    },
    darkgrey: {
        color: constants.darkGrey,
    },
    lightgrey: {
        color: constants.lightGrey,
    },
    white: {
        color: constants.white,
    },
    black: {
        color: constants.black,
    },
});

const lightModeStyles = StyleSheet.create({
    bgColor: {
        backgroundColor: constants.lightGrey,
    },
    buttonBgColor: {
        backgroundColor: constants.blue,
    },
    buttonTextColor: {
        color: constants.white,
    },
    textColor: {
        color: constants.black,
    },
    navHeader: {
        backgroundColor: constants.lighterGrey,
        color: constants.black,
    }
});

const darkModeStyles = StyleSheet.create({
    bgColor: {
        backgroundColor: constants.darkGrey,
    },
    buttonBgColor: {
        backgroundColor: constants.blue,
    },
    buttonTextColor: {
        color: constants.white,
    },
    textColor: {
        color: constants.white,
    },
    navHeader: {
        backgroundColor: constants.lighterDarkGrey,
        color: constants.white,
    }
});

let styleMap = {
    "global": globalStyles,
    "darkMode": darkModeStyles,
    "lightMode": lightModeStyles,
    "constants": constants,
}

export default styleMap;