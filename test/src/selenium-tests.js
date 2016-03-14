'use strict';

let webdriver = require('selenium-webdriver'),
    logging = webdriver.logging,
    chrome = require('selenium-webdriver/chrome'),
    chromePath = require('chromedriver').path,
    async = require('async'),
    until = webdriver.until,
    path = require('path'),
    By = webdriver.By,
    assert = require('assert'),
    crypto = require('crypto'),
    process = require('process'),
    seo = require(process.cwd()+'/tests-client/configuration/seo'),
    buildResult = require(process.cwd()+'/static/build-result'),
    themeSecond = require(process.cwd()+'/tests-client/configuration/theme-second'),
    build = require(process.cwd()+'/configuration/static'),
    _ = require('underscore');

function runChrome() {
    var service = new chrome.ServiceBuilder(chromePath).build();
    chrome.setDefaultService(service);

    return new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .build()
}

var browser = runChrome();

describe('client unit tests', function() {
    before(done => {
        browser.get('http://localhost:8000/unit-tests')
            .then(() => {
                done()
            })
    });

    describe('wait for tests to finish', function() {
        it('failed tests count should be 0', function(done) {
            browser.wait(until.elementLocated(By.css('.failures em')), 30 * 1000)
                .then(element => {
                    element.getInnerHtml().then(html => {
                        assert.equal(html, '0');
                        done()
                    })
                })
        })
    })
});

describe('client functional tests', function() {
    before(done => {
        browser.get('http://localhost:8000/page1')
            .then(() => {
                done()
            })
    });

    after(done => {
        browser.quit();
        done()
    });

    describe('first page', function() {
        describe('check title', function() {
            it('should be correct', function(done) {
                checkTitle(seo.page1.title, done)
            });
        });

        describe('check meta', function() {
            it('should be correct', function(done) {
                checkMeta(seo.page1, done)
            })
        });

        describe('action button', function() {
            it('should alert awesome!', function(done) {
                browser.findElement(By.id('action-button')).then(element => {
                    element.click()
                });
                browser.wait(until.alertIsPresent(), 1000).then(() => {
                    browser.switchTo().alert().getText().then(text => {
                        assert.equal('awesome!', text);
                        browser.switchTo().alert().accept().then(done)
                    })
                });
            });
        });

        describe('open page 2', function() {
            it('should load second page', function(done) {
                browser.wait(until.elementLocated(By.css('a[href="/page2"]')), 30 * 1000)
                    .then(element => {
                        element.click().then(done)
                    });
            })
        })
    });

    describe('second page', function() {
        describe('check title', function() {
            it('title should be second page', function(done) {
                checkTitle(seo.page2.title, done)
            })
        });

        describe('check meta', function() {
            it('should be correct', function(done) {
                checkMeta(seo.page2, done)
            })
        });

        describe('check resources', function() {
            it('should load resources in 1 instance', function(done) {
                checkResources(themeSecond, done)
            })
        });

        describe('render data', function() {
            it('should populate table with data', function(done) {
                browser.wait(until.elementLocated(By.id('data-render-btn')), 30 * 1000)
                    .then(element => {
                        element.click()
                    });

                browser.wait(until.elementsLocated(By.css('#data-table tr')), 30 * 1000)
                    .then(rows => {
                        assert(rows.length > 2);
                        done()
                    });
            })
        });

        describe('add data row', function() {
            it('should submit form', function(done) {
                let invalidData = [
                    null,
                    null,
                    null
                ];
                let validData = [
                    crypto.randomBytes(12).toString('hex'),
                    Math.round(Math.random() * (1 - 99) + 1),
                    crypto.randomBytes(12).toString('hex')
                ];
                sendDataForm(invalidData, 'invalid data')
                    .then(() => {
                        return sendDataForm(validData, 'success')
                    })
                    .then(() => {
                        done()
                    })
            })
        });

        describe('upload images', function() {
            it('should submit form', function(done) {
                let invalidData1 = [
                    null,
                    null
                ];
                let invalidData2 = [
                    crypto.randomBytes(12).toString('hex'),
                    '/home/dmitriy/images/20141016-1-1.jpg'
                ];
                let validData = [
                    crypto.randomBytes(12).toString('hex'),
                    '/home/dmitriy/images/snapshot1.png'
                ];
                let errorStatus = 'invalid data';
                sendImagesForm(invalidData1, errorStatus)
                    .then(() => {
                        return sendImagesForm(invalidData2, errorStatus)
                    })
                    .then(() => {
                        return sendImagesForm(validData, 'success')
                    })
                    .then(() => {
                        done()
                    })
            })
        })
    })
});

function checkTitle(title, done) {
    browser.wait(until.titleIs(title), 30 * 1000).then(() => {
        done()
    })
}

function checkMeta(meta, done) {
    waitForMetaTag(meta.description)
        .then(() => {
            return waitForMetaTag(meta.keywords.join(', '))
        })
        .then(() => {
            done()
        })
}

function waitForMetaTag(content) {
    return browser.wait(until.elementLocated(By.css(`meta[content="${content}"]`)), 30 * 1000)
}

function checkResources(theme, done) {
    _.pairs(theme.bundles).reduce((promise, pair) => {
        return promise.then(() => {
            return Promise.all([
                checkJS.apply(null, pair),
                checkStyles.apply(null, pair),
                checkTemplates.apply(null, pair),
                checkSVG.apply(null, pair)
            ])
        })
    }, Promise.resolve())
        .then(() => {
            done()
        })
}

function checkJS(name, bundle) {
    if(bundle.js) {
        let src = `${build.prefix}/${buildResult[name].js}`;
        return browser.wait(until.elementsLocated(By.css(`script[src="${src}"]`)), 30 * 1000)
            .then(elements => {
                return assert(elements.length == 1, 'should load only 1 js script')
            })
    }
}

function checkStyles(name, bundle) {
    if(bundle.styles) {
        let href = `${build.prefix}/${buildResult[name].styles}`;
        return browser.wait(until.elementsLocated(By.css(`link[href="${href}"]`)), 30 * 1000)
            .then(elements => {
                return assert(elements.length == 1, 'should load only 1 css file')
            })
    }
}

function checkTemplates(name, bundle) {
    if(bundle.templates) {
        let src = `${build.prefix}/${buildResult[name].templates}`;
        return browser.wait(until.elementsLocated(By.css(`script[src="${src}"]`)), 30 * 1000)
            .then(elements => {
                return assert(elements.length == 1, 'should load only 1 templates file')
            })
    }
}

function checkSVG(name, bundle) {
    if(bundle.svg) {
        let src = `${build.prefix}/${buildResult[name].svg}`;
        return browser.wait(until.elementsLocated(By.css(`[data-src="${src}"]`)), 30 * 1000)
            .then(elements => {
                return assert(elements.length == 1, 'should load only 1 svg file')
            })
    }
}

function sendDataForm(fields, status) {
    browser.wait(until.elementLocated(By.id('data-form')), 30 * 1000)
        .then(form => {
            let field1 = form.findElement(By.css('[name="field1"]')),
                field2 = form.findElement(By.css('[name="field2"]')),
                field3 = form.findElement(By.css('[name="field3"]'));
            field1.sendKeys(fields[0]);
            field2.sendKeys(fields[1]);
            field3.sendKeys(fields[2]);
            form.submit()
        });

    return browser.wait(until.alertIsPresent(), 1000).then(() => {
        return browser.switchTo().alert().getText().then(text => {
            assert.equal(status, text);
            return browser.switchTo().alert().accept()
        })
    });
}

function sendImagesForm(fields, status) {
    browser.wait(until.elementLocated(By.id('album-form')), 30 * 1000)
        .then(form => {
            let title = form.findElement(By.css('[name="title"]')),
                file = form.findElement(By.css('[type="file"]'));
            title.sendKeys(fields[0]);
            if(fields[1]) {
                file.sendKeys(fields[1]);
            }
            form.submit()
        });

    return browser.wait(until.alertIsPresent(), 1000).then(() => {
        return browser.switchTo().alert().getText().then(text => {
            assert.equal(status, text);
            return browser.switchTo().alert().accept()
        })
    })
}
