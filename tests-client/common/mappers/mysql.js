'use strict';

let KnexMapper = require(app.get('commonPath')+'/mappers/knex-mapper');

class MysqlModel {}

class MysqlMapper extends KnexMapper {
    constructor() {
        super({
            client: 'mysql'
        })
    }

    get tableName() {
        return 'mysql'
    }

    get fileName() {
        return 'knex-mapper';
    }

    get model() {
        return MysqlModel
    }
}