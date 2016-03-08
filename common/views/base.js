'use strict';

let fs = require('fs');

try {
    var Backbone = require('backbone');
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
        for(let i in this.templateDirs) {
            let dir = this.templateDirs[i];
            let file = `${dir}/${name}`;
            try {
                fs.accessSync(file);
                let tpl = fs.readFileSync(file, 'utf8');
                if(tpl) {
                    return this.compile(tpl, data)
                }
            } catch(e) {}
        }
        throw new Error(`cannot find template ${name}`)
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