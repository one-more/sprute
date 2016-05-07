'use strict';

let _ = require('underscore');

module.exports = class {
    get collection() {
        return Array
    }

    get model() {
        throw new Error('mapper should specify model')
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
        if(data instanceof Array && data.length) {
            return this.populateModel(data[0])
        } else if(typeof data == 'object' && Object.keys(data).length) {
            return this.populateModel(data)
        } else {
            return null
        }
    }

    parseAsCollection(data) {
        data = data.map(this.populateModel.bind(this));
        return new (this.collection.bind.apply(this.collection, [null].concat(data)))
    }

    get PK() {
        return ((new this.model).primaryKey || _.noop)() || 'id'
    }

    save(model) {
        let data;
        if(data = this.validateModel(model)) {
            if(model instanceof this.model || model[this.PK]) {
                return this.update(data)
            } else {
                return this.insert(data)
            }
        } else {
            throw new Error('invalid data')
        }
    }

    validateModel() {
        throw new Error('mapper should specify validateModel method')
    }

    get validationErrors() {
        throw new Error('mapper should specify getter for validation errors')
    }

    insert() {
        throw new Error('mapper should specify insert method')
    }

    update() {
        throw new Error('mapper should specify update method')
    }
};