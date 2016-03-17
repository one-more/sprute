'use strict';

let process = require('process'),
    config = require(process.cwd()+'/configuration/i18n');

module.exports = {
    translate(section, phrase, language) {
        let currentLanguage = language || this.currentLanguage;
        let dictionary = this.loadSection(section, currentLanguage);
        if(dictionary) {
            return dictionary[phrase] || phrase
        }
        return phrase
    },

    get currentLanguage() {
        return config.currentLanguage
    },

    get sourceLanguage() {
        return config.sourceLanguage
    },

    get loadSection() {
        return config.loadSection
    },

    init() {
        return this
    }
};