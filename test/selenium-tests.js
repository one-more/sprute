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
    crypto = require('crypto');

function runChrome() {
    var service = new chrome.ServiceBuilder(chromePath).build();
    chrome.setDefaultService(service);

    return new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .build()
}

var browser = runChrome();

browser.get('http://localhost:8000/page1');

describe('client functional tests', function() {
    after((done) => {
        browser.quit();
        done()
    });
    describe('first page', function() {
        describe('check title', function() {
            it('title should be first page', function(done) {
                browser.wait(until.titleIs('first page'), 30 * 1000).then(() => {
                    done()
                })
            });
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
                browser.wait(until.titleIs('second page'), 30 * 1000)
                    .then(() => {
                        done()
                    })
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
                browser.wait(until.elementLocated(By.id('data-form')), 30 * 1000)
                    .then(form => {
                        let field1 = form.findElement(By.css('[name="field1"]')),
                            field2 = form.findElement(By.css('[name="field2"]')),
                            field3 = form.findElement(By.css('[name="field3"]'));
                        field1.sendKeys(crypto.randomBytes(12).toString('hex'));
                        field2.sendKeys(Math.round(Math.random() * (1 - 99) + 1));
                        field3.sendKeys(crypto.randomBytes(12).toString('hex'));
                        form.submit()
                    });

                browser.wait(until.alertIsPresent(), 1000).then(() => {
                    browser.switchTo().alert().getText().then(text => {
                        assert.equal('success', text);
                        browser.switchTo().alert().accept().then(done)
                    })
                });
            })
        });

        describe('upload images', function() {
            it('should submit form', function(done) {
                browser.wait(until.elementLocated(By.id('album-form')), 30 * 1000)
                    .then(form => {
                        let title = form.findElement(By.css('[name="title"]')),
                            file = form.findElement(By.css('[type="file"]'));
                        title.sendKeys(crypto.randomBytes(12).toString('hex'));
                        file.sendKeys('/home/dmitriy/images/snapshot1.png');
                        form.submit()
                    });

                browser.wait(until.alertIsPresent(), 1000).then(() => {
                    browser.switchTo().alert().getText().then(text => {
                        assert.equal('success', text);
                        browser.switchTo().alert().accept().then(done)
                    })
                })
            })
        })
    })
});
