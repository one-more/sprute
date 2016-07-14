'use strict';

const BaseRouter = require(app.get('classPath')+'/routers/base');

class TestRouter extends BaseRouter {
    search(req) {
        expect(+req.cookies.testCookie1).to.be.equal(1);
        expect(+req.cookies.testCookie2).to.be.equal(2);

        expect(req.params.query).to.be.oneOf([
            'news', 'тест'
        ])
    }

    searchWithPage(req) {
        expect(req.params.query).to.be.oneOf([
            'nyc', 'manhattan'
        ]);
        expect(req.params.page).to.be.above(5)
    }

    loadContact(req) {
        expect(req.params.id).to.be.equal('foo')
    }

    optionalItem(req) {
        expect(req.params.item).to.be.equal('thing')
    }

    namedOptional(req) {
        expect(req.params.z).to.be.equal('123')
    }

    splat(req) {
        expect(req.params[0]).to.be.equal('long-list/of/splatted_99args')
    }
    github(req) {
        expect(req.params.repo).to.be.equal('backbone');
        expect(req.params[0]).to.be.equal('1.0');
        expect(req.params[1]).to.be.equal('braddunbar:with/slash')
    }

    decode(req) {
        expect(req.params.named).to.be.equal('a/b');
        expect(req.params[0]).to.be.equal('c/d/e')
    }

    complex(req) {
        expect(req.params[0]).to.be.equal('one/two/three');
        expect(req.params[1]).to.be.equal('part');
        expect(req.params[2]).to.be.equal('four/five/six/seven')
    }

    query(req) {
        expect(req.params.entity).to.be.oneOf(['test', 'mandel'])
    }

    queryParams(req) {
        expect(+req.query.param1).to.be.equal(1);
        expect(+req.query.param2).to.be.equal(2);
        expect(+req.query.param3).to.be.equal('три');
    }

    anything(req) {
        expect(req.params[0]).to.not.be.undefined
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
    'query-params': 'queryParams',
    'function/:value': req => {
        expect(req.params.value).to.be.equal('set')
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
    '/query/test?a=b',
    '/query-params?param1=1&param2=2&param3=три',
    '/doesnt-match-a-route',
    '/function/set',
    '/decode/a%2Fb/c%2Fd/e'
];

describe('router', function() {
    it('test route params', function(done) {
        new TestRouter({
            routes
        });
        deleteCookie('testCookie1');
        deleteCookie('testCookie2');
        setCookie('testCookie1', 1, {path:'/'});
        setCookie('testCookie2', 2, {path:'/'});
        setTimeout(() => {
            urls.forEach(url => {
                app.get('history').navigate(url, {trigger: true})
            });
            app.get('history').navigate('/unit-tests');
            done()
        }, 0)
    })
});