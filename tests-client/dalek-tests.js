'use strict';

module.exports = {
    'Testing pages': function(test) {
        test
            .open('http://localhost:8000/unit-tests/')
            .waitFor(() => {
                return !!window.testRunner
            })
            .assert.text('.failures em', '0', 'all tests should pass')
            .done()
    }
};