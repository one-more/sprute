'use strict';

let $ = require('jquery'),
    process = require('process'),
    _ = require('underscore'),
    buildResult = require(process.cwd()+'/static/build-result'),
    build = require(process.cwd()+'/configuration/static');

function checkScript(src) {
    return new Promise((resolve, reject) => {
        let scripts = Array.from(document.querySelectorAll('script'));
        if(scripts.find(script => script.getAttribute('src') == src)) {
            resolve()
        } else {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.onload = () => {
                clearTimeout(errTimeout);
                resolve()
            };
            script.onreadystatechange = () => {
                if(this.readyState == 'complete') {
                    clearTimeout(errTimeout);
                    resolve()
                }
            };
            document.body.appendChild(script);
            var errTimeout = setTimeout(() => {
                reject(`can not load ${src}`)
            }, 15000)
        }
    })
}

function loadStyles(href) {
    return new Promise((resolve, reject) => {
        let link = document.createElement('link');
        link.setAttribute('href', href);
        link.setAttribute( 'rel', 'stylesheet' );
        link.setAttribute( 'type', 'text/css' );
        let sheet, cssRules;
        if('sheet' in link) {
            sheet = 'sheet'; cssRules = 'cssRules';
        } else {
            sheet = 'styleSheet'; cssRules = 'rules';
        }
        var interval_id = setInterval(() => {
                try {
                    if (link[sheet] && link[sheet][cssRules].length) {
                        clearInterval(interval_id);
                        clearTimeout(timeout_id);
                        resolve();
                    }
                } catch(e) {} finally {}
            }, 10),
            timeout_id = setTimeout(() => {
                clearInterval(interval_id);
                clearTimeout(timeout_id);
                document.head.removeChild(link);
                reject(`can not load ${href}`);
            }, 15000);
        document.head.appendChild(link)
    })
}

function checkStyles(name, bundle) {
    return new Promise(resolve => {
        if(bundle.styles) {
            let links = Array.from(document.querySelectorAll('link[rel=stylesheet]')),
                href = `${build.prefix}/${buildResult[name].styles}`;
            if(links.find(link => link.getAttribute('href') == href)) {
                resolve()
            } else {
                return loadStyles(href)
            }
        } else {
            resolve()
        }
    })
}

function checkJS(name, bundle) {
    if(bundle.js) {
        let src = `${build.prefix}/${buildResult[name].js}`;
        return checkScript(src)
    } else {
        return Promise.resolve()
    }
}

function checkTemplates(name, bundle) {
    if(bundle.templates) {
        let src = `${build.prefix}/${buildResult[name].templates}`;
        return checkScript(src)
    } else {
        return Promise.resolve()
    }
}

module.exports = class {
    constructor(theme) {
        this.theme = theme
    }

    loadTheme() {
        return new Promise(resolve => {
            _.pairs(this.theme.bundles).reduce((promise, pair) => {
                return promise.then(() => {
                    return Promise.all([
                        checkStyles.apply(null, pair),
                        checkJS.apply(null, pair),
                        checkTemplates.apply(null, pair)
                    ])
                })
            }, Promise.resolve()).then(resolve)
        })
    }

    setBlock(name, content) {
        $(document.all[`${name}-block`]).html(content)
    }

    initViews(views) {
        views.forEach(name => {
            new (require(`${this.theme.viewsPath}/${name}`))(this.theme)
        })
    }
};