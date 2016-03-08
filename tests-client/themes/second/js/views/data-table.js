'use strict';

let BaseView = require(app.get('commonPath')+'/views/base'),
    mapper = require('../../../../common/mappers/mysql');

module.exports = class extends BaseView {
    constructor(theme) {
        super();

        this.setTemplateDir(theme.templatesPath+'/data-table')
    }

    get el() {
        return '#data'
    }

    get events() {
        return {
            'click #data-render-btn': 'renderTable'
        }
    }

    renderTable() {
        (new mapper).find().then(data => {
            this.$el.find('#data-table').html(this.getTemplate('table.tpl.html', {
                rows: data
            }))
        })
    }
};