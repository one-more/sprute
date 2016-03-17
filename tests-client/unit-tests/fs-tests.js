'use strict';

let fs = require('fs');

describe('fs', function() {
    describe('#readFile', function() {
        it('should return file contents', function(done) {
            fs.readFile('/static/bundle-result.js', function(err, content) {
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
            expect(fs.readFileSync('/static/bundle-result.js')).to.have.length.above(20);
            expect(fs.readFileSync.bind(null, '/static')).to.throw(Error);
            done()
        })
    });
    describe('#readdir', function() {
        it('should return array with names of its content', function(done) {
            fs.readdir('/static', function(err, content) {
                expect(content).to.eql(['bundle-result.js'])
            });
            fs.readdir('/static/bundle-result.js', function(err, content) {
                expect(err).to.be.an.instanceof(Error);
                done()
            })
        })
    });
    describe('#readdirSync', function() {
        it('should return array with names of its content', function(done) {
            expect(fs.readdirSync('/static')).to.eql(['bundle-result.js']);
            expect(fs.readdirSync.bind(null, '/static/bundle-result.js')).to.throw(Error);
            done()
        })
    });
    describe('#exists', function() {
        it('should check whether file or dir exists', function(done) {
            fs.exists('/static', function(exists) {
                expect(exists).to.be.ok
            });
            fs.exists('/statics', function(exists) {
                expect(exists).to.be.not.ok
            });
            fs.exists('/static/bundle-result.js', function(exists) {
                expect(exists).to.be.ok
            });
            fs.exists('/static/bundle-result.j', function(exists) {
                expect(exists).to.be.not.ok;
                done()
            })
        })
    });
    describe('#existsSync', function() {
        it('should check whether file or dir exists', function(done) {
            expect(fs.existsSync('/static')).to.be.ok;
            expect(fs.existsSync('/statics')).to.be.not.ok;
            expect(fs.existsSync('/static/bundle-result.js')).to.be.ok;
            expect(fs.existsSync('/static/bundle-result.j')).to.be.not.ok;
            done()
        })
    });
    describe('#access', function() {
        it('should check file access permissions', function(done) {
            let paths = ['./static', './static/bundle-result.js'];
            let permissions = [fs.F_OK, fs.R_OK, fs.W_OK, fs.X_OK, 8];
            for(let i=0; i<paths.length; i++) {
                let path = paths[i];

                fs.access(path+'s', err => {
                    expect(err).to.be.an.instanceof(Error)
                });
                for(let j=0; j<permissions.length; j++) {
                    fs.access(path+'s', permissions[j], err => {
                        expect(err).to.be.an.instanceof(Error)
                    });
                }

                let permissionsOk = permissions.slice(0, 2);
                let permissionsError = permissions.slice(2);
                for(let h=0; h<permissionsError.length; h++) {
                    fs.access(path, permissionsError[h], err => {
                        expect(err).to.be.an.instanceof(Error)
                    });
                }

                fs.access(path, err => {
                    expect(err).to.be.null
                });
                for(let k=0; k<permissionsOk.length; k++) {
                    fs.access(path, permissionsOk[k], err => {
                        expect(err).to.be.null;
                        if((i == paths.length-1) && (k == permissionsOk.length-1)) {
                            done()
                        }
                    });
                }
            }
        })
    });
    describe('#accessSync', function() {
        it('should check file access permissions', function(done) {
            let paths = ['./static', './static/bundle-result.js'];
            let permissions = [fs.F_OK, fs.R_OK, fs.W_OK, fs.X_OK, 8];
            for(let i=0; i<paths.length; i++) {
                let path = paths[i];

                expect(fs.accessSync.bind(null, path+'s')).to.throw(Error);
                for(let j=0; j<permissions.length; j++) {
                    expect(fs.accessSync.bind(null, path+'s', permissions[j])).to.throw(Error)
                }

                let permissionsOk = permissions.slice(0, 2);
                let permissionsError = permissions.slice(2);
                for(let h=0; h<permissionsError.length; h++) {
                    expect(fs.accessSync.bind(null, path, permissionsError[h])).to.throw(Error)
                }

                expect(fs.accessSync(path)).to.be.undefined;
                for(let k=0; k>permissionsOk.length; k++) {
                    expect(fs.accessSync(path, permissionsOk[k])).to.be.undefined
                }
            }
            done()
        })
    })
});