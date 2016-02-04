'use strict';

let fs = require('fs');

try {
    var Backbone = require('Backbone');
} catch(e) {
    Backbone = {
        View: function () {}
    };
}

module.exports = class extends Backbone.View {
    setTemplateDir(path) {
        this.templateDirs = [path]
    }

    addTemplateDir(path) {
        !this.templateDirs && (this.templateDirs = []);
        this.templateDirs.push(path)
    }

    getTemplate(name, data) {
        let result;
        this.templateDirs.forEach(dir => {
            let file = `${dir}/${name}`;
            if(fs.existsSync(file)) {
                let tpl = fs.readFileSync(file, 'utf8');
                result = this.compile(tpl, data)
            }
        });
        return result
    }

    compile(tpl, data) {
        let templateEngine = app.get('templateEngine');
        try {
            var compiled = new templateEngine(tpl);
        } catch(e) {
            console.error(e)
        }
        return compiled.fetch(Object.assign(data || {}, {templateDirs: this.templateDirs}))
    }
};