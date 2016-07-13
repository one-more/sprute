'use strict';

describe('require', function() {
    const expect = require('chai').expect;
    it('require when main is an array', function(done) {
        window.$ = require('jquery');
        window.jQuery = $;
        require('lightgallery');
        done()
    });

    it('require when main starts with /', function(done) {
        require('test-component');
        done()
    });

    it('require module/file', function(done) {
        require('socket.io-client/socket.io');
        done()
    });

    it('require relative path from global module', function(done) {
        const moment = require('moment');
        moment.locale('ru');
        //console.log(moment(1316116057189).fromNow());
        expect(moment.locale()).to.be.equal('ru');
        done()
    })
});