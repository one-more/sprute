'use strict';

const BaseRouter = require(app.get('classPath')+'/routers/base');

class TestRouter extends BaseRouter {
    search(req) {
        expect(req.params.query).to.not.be.undefined
    }

    searchWithPage(req) {
        expect(req.params.query).to.not.be.undefined;
        expect(req.params.page).to.be.above(5)
    }

    loadContact(req) {
        expect(req.params.id).to.be.equal('foo')
    }

    optionalItem(req) {
        expect(req.params.item).to.be.equal('thing')
    }

    namedOptional(req) {
        console.log(arguments)
    }
}

const routes = {
    'search/:query': 'search',
    'search/:query/p:page': 'searchWithPage',
    'contacts/:id': 'loadContact',
    'route-event/:arg': 'routeEvent',
    'optional(/:item)': 'optionalItem',
    'named/optional/(y:z)': 'namedOptional',
    'splat/*args/end': 'splat',
    ':repo/compare/*from...*to': 'github',
    'decode/:named/*splat': 'decode',
    '*first/complex-*part/*rest': 'complex',
    'query/:entity': 'query',
    'function/:value': req => {
        expect(req.params.value).to.not.be.undefined
    },
    '*anything': 'anything'
};

const urls = [
    '/search/news',
    '/search/тест',
    '/search/nyc/p10',
    '/search/manhattan/p20',
    '/contacts/foo',
    '/optional/thing',
    '/named/optional/y',
    '/named/optional/y123',
    '/splat/long-list/of/splatted_99args/end',
    '/backbone/compare/1.0...braddunbar:with/slash',
    '/optional/thing',
    '/one/two/three/complex-part/four/five/six/seven',
    '/query/mandel?a=b&c=d',
    '/doesnt-match-a-route',
    '/function/set',
    '/decode/a%2Fb/c%2Fd/e',
    '/query/test?a=b'
];

describe('router', function() {
    it('test route params', function(done) {
        new TestRouter({
            routes
        });
        setTimeout(() => {
            urls.forEach(url => {
                app.get('history').navigate(url, {trigger: true})
            });
            app.get('history').navigate('/unit-tests');
            done()
        }, 0)
    })
});