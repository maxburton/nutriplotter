/*
	Populates a mongodb database with default settings
*/

import React from 'react';

var Datastore = require('react-native-local-mongodb'),
globalSettingsdb = new Datastore({ filename: 'globalSettings', autoload: true });

export default class PopulateSettings extends React.Component {
    isLoaded = false;
    constructor() {
        super();

        globalSettingsdb.insert([
            { _id: "isFirstLaunch", value: true },
            { _id: "darkMode", value: false },
        ], function (err, newDocs) {
            
            if (err) {
                console.log("Errors: " + err);
                throw err;
            }
            this.isLoaded = true;
        });
    }

    getStatus(){
        return this.isLoaded;
    }
}