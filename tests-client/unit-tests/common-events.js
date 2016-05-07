'use strict';

const commonEvents = require(app.get('commonPath')+'/events/common');

describe('CommonEvents', function() {
    it('error event', function(done) {
        setTimeout(() => {
            commonEvents.on('error', e => {
                expect(e.error).to.be.instanceOf(Error);
                done()
            });

            expect(1).to.be.equal(2)
        }, 0)
    })
});