/**
    This file contains code of Backbone.View class.

    Copyright (c) 2010-2016 Jeremy Ashkenas, DocumentCloud

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

let fs = require('fs'),
    _ = require('underscore');

module.exports = class {
    constructor() {
        app.clientSide(() => {
            this.cid = _.uniqueId('view');
            this._ensureElement()
        })
    }

    get tagName() {
        return 'div'
    }

    $(selector) {
        return this.$el.find(selector)
    }

    render() {}

    remove() {
        this._removeElement();
        return this
    }

    _removeElement() {
        this.$el.remove()
    }

    setElement(element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this
    }

    _setElement(el) {
        let $ = require('jquery');
        this.$el = el instanceof $ ? el : $(el)
    }

    delegateEvents(events) {
        events || (events = _.result(this, 'events'));
        if(!events) {
            return this;
        }
        this.undelegateEvents();
        for(let key in events) {
            if(events.hasOwnProperty(key)) {
                let method = events[key];
                if(!_.isFunction(method)) {
                    method = this[method];
                }
                if(!method) {
                    continue;
                }
                let match = key.match(/^(\S+)\s*(.*)$/);
                this.delegate(match[1], match[2], _.bind(method, this));
            }
        }
        return this
    }
    
    delegate(eventName, selector, listener) {
        this.$el.on(`${eventName}.delegateEvents${this.cid}`, selector, listener);
        return this   
    }
    
    undelegateEvents() {
        if(this.$el) {
            this.$el.off(`.delegateEvents${this.cid}`);
        }
        return this
    }
    
    undelegate(eventName, selector, listener) {
        this.$el.off(`${eventName}.delegateEvents${this.cid}`, selector, listener);
        return this
    }
    
    _createElement(tagName) {
        return document.createElement(tagName)
    }
    
    _ensureElement() {
        if(!this.el) {
            let attributes = _.extend({}, _.result(this, 'attributes'));
            if(this.id) {
                attributes.id = _.result(this, 'id');
            }
            if(this.className) {
                attributes['class'] = _.result(this, 'className');
            }
            this.setElement(this._createElement(_.result(this, 'tagName')));
            this._setAttributes(attributes);
        } else {
            this.setElement(_.result(this, 'el'));
        }
    }

    _setAttributes(attributes) {
        this.$el.attr(attributes)
    }

    setTemplateDir(path) {
        if(_.isArray(path)) {
            this.templateDirs = path
        } else {
            this.templateDirs = [path]
        }
        return this
    }

    addTemplateDir(path) {
        !this.templateDirs && (this.templateDirs = []);
        if(_.isArray(path)) {
            this.templateDirs.concat(path)
        } else {
            this.templateDirs.push(path);
        }
        return this
    }

    getTemplate(name, data) {
        for(let i in this.templateDirs) {
            if(this.templateDirs.hasOwnProperty(i)) {
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
        }
        throw new Error(`cannot find template ${name}`)
    }

    compile(tpl, data) {
        try {
            let templateEngine = app.get('templateEngine'),
                compiled = new templateEngine(tpl);
            return compiled.fetch(Object.assign(data || {}, {templateDirs: this.templateDirs}))
        } catch(e) {
            console.error(e)
        }
    }
};