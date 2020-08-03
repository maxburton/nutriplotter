// Global styles

import { StyleSheet } from 'react-native';

export const Colors = {
    dark: '#000000',
    light: '#FFFFFF'
};

const offset = 24;

const baseContainerStyles = {
    flex: 1
}

const baseTestStyles = {
    flex: 1
}

const baseTitleStyles = {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset
}

const baseListStyles = {
    flex: 1
}

const baseDefaultText= {
    color: 'black',
    fontSize: offset,
    padding: 15,
    backgroundColor: "#00BFFF",
	textAlign: 'center',
}

const baseButtonText= {
	fontSize: offset,
	textAlign: 'center',
}

const baseSettingList = {
    backgroundColor: '#FFFFFF',
    //titleStyle: {color: '#000000'}
}

const global = StyleSheet.create({
    flex: {
        flex: 1
    },
    
    // colours
    blue: {
        color: "blue",
    },
    red: {
        color: "red",
    },
    green: {
        color: "green",
    },
    grey: {
        color: "grey",
    },
    darkgrey: {
        color: "#f3f3f3",
    },
    white: {
        color: "#fff"
    },
    black: {
        color: "#000"
    },
});

const lightStyleSheet = StyleSheet.create({
    container: {
        ...baseContainerStyles,
    },
    test: {
        ...baseTestStyles,
    },
    title: {
        ...baseTitleStyles,
    },
    list: {
        ...baseListStyles,
    },
    defaultText: {
        ...baseDefaultText,
    },
    buttonText: {
        ...baseButtonText,
    },
    settingsList: {
        ...baseSettingList,
    }
});

const darkStyleSheet = StyleSheet.create({
    container: {
        ...baseContainerStyles,
    },
    test: {
        ...baseTestStyles,
    },
    title: {
        ...baseTitleStyles,
    },
    list: {
        ...baseListStyles,
    },    defaultText: {
        ...baseDefaultText,
    },
    buttonText: {
        ...baseButtonText,
    },
    settingsList: {
        ...baseSettingList,
    }
});

export default function getStyleSheet(useDarkTheme) {
    return useDarkTheme ? darkStyleSheet : lightStyleSheet;
}