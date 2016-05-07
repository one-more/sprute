'use strict';

describe('require', function() {
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
    })
});