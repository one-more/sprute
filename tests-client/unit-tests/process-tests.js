'use strict';

var process = require('process');

describe('process', function() {
    describe('#cwd', function() {
        it('should return /', function(done) {
            expect(process.cwd()).to.equal('/');
            done()
        })
    });
    describe('#chdir', function() {
        it('should change working directory', function(done) {
            process.chdir('../../../../../../');
            expect(process.cwd()).to.equal('/');
            process.chdir('./static');
            expect(process.cwd()).to.equal('/static');
            process.chdir('../common');
            expect(process.cwd()).to.equal('/common');
            process.chdir('./modules');
            expect(process.cwd()).to.equal('/common/modules');
            process.chdir('./meta');
            expect(process.cwd()).to.equal('/common/modules/meta');
            process.chdir('/build');
            expect(process.cwd()).to.equal('/build');
            process.chdir('configuration');
            expect(process.cwd()).to.equal('/configuration');
            expect(process.chdir.bind(null, 'undefined')).to.throw(Error);
            process.chdir('/');
            done()
        })
    });
    describe('#nextTick', function() {
        it('should execute code async as fast as can', function(done) {
            process.nextTick(done.bind(null, undefined))
        })
    })
});