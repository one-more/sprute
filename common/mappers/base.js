'use strict';

let _ = require('underscore');

module.exports = class {
    get collection() {
        return Array
    }

    get fileName() {
        throw new Error('mapper should specify fileName')
    }

    find() {
        throw new Error('mapper should specify find method')
    }

    findOne() {
        throw new Error('mapper should specify findOne method')
    }

    fromQueryObject() {
        throw new Error('mapper should specify fromQueryObject method')
    }

    populateModel(data) {
        return _.extend(new this.model, data)
    }

    parseAsModel(data) {
        if(data.length) {
            return this.populateModel(data[0])
        } else {
            return null
        }
    }

    parseAsCollection(data) {
        data = data.map(this.populateModel.bind(this));
        return new (this.collection.bind.apply(this.collection, [null].concat(data)))
    }
};