const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  test('Viewing one stock: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        done();
      });
  });

  test('Viewing one stock and liking it: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&likes=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&likes=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test('Viewing two stocks: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&stock=GOOGL')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        assert.property(res.body.stockData[0], 'stock');
        assert.property(res.body.stockData[1], 'stock');
        done();
      });
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&stock=GOOGL&likes=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.property(res.body.stockData[1], 'rel_likes');
        assert.equal(res.body.stockData[0].rel_likes, 1);
        assert.equal(res.body.stockData[1].rel_likes, 1);
        done();
      });
  });
});
