'use strict';

let fs = require('fs');

describe('fs', function() {
    describe('#readFile', function() {
        it('should return file contents', function(done) {
            fs.readFile('/static/build-result.js', function(err, content) {
                expect(content).to.have.length.above(20)
            });
            fs.readFile('/static', function(err) {
                expect(err).to.be.an.instanceof(Error);
                done()
            })
        })
    });
    describe('#readFileSync', function() {
        it('should return file contents', function(done) {
            expect(fs.readFileSync('/static/build-result.js')).to.have.length.above(20);
            expect(fs.readFileSync.bind(null, '/static')).to.throw(Error);
            done()
        })
    });
    describe('#readdir', function() {
        it('should return array with names of its content', function(done) {
            fs.readdir('/static', function(err, content) {
                expect(content).to.eql(['build-result.js'])
            });
            fs.readdir('/static/build-result.js', function(err, content) {
                expect(err).to.be.an.instanceof(Error);
                done()
            })
        })
    });
    describe('#readdirSync', function() {
        it('should return array with names of its content', function(done) {
            expect(fs.readdirSync('/static')).to.eql(['build-result.js']);
            expect(fs.readdirSync.bind(null, '/static/build-result.js')).to.throw(Error);
            done()
        })
    });
    describe('#exists', function() {
        it('should check whether file or dir exists', function(done) {
            fs.exists('/static', function(exists) {
                expect(exists).to.be.ok
            });
            fs.exists('/static/build-result.js', function(exists) {
                expect(exists).to.be.ok
            });
            fs.exists('/static/build-result.j', function(exists) {
                expect(exists).to.be.not.ok;
                done()
            })
        })
    });
    describe('#existsSync', function() {
        it('should check whether file or dir exists', function(done) {
            expect(fs.existsSync('/static')).to.be.ok;
            expect(fs.existsSync('/static/build-result.js')).to.be.ok;
            expect(fs.existsSync('/static/build-result.j')).to.be.not.ok;
            done()
        })
    })
});