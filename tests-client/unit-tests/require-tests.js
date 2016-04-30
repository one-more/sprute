'use strict';

describe('require', function() {
    it('require when main is array', function(done) {
        window.$ = require('jquery');
        window.jQuery = $;
        require('lightgallery');
        done()
    })
});