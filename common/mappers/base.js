'use strict';

let _ = require('underscore');

module.exports = class {
    get collection() {
        return Array
    }

    find() {}

    findOne() {}

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