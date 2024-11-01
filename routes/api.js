'use strict';

const apiurl = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"

module.exports = function (app) {
  app.route('/api/stock-prices').get((req, res) => {
    const stocks = Array.isArray(req.query.stock) ? req.query.stock : [req.query.stock];
    const likes = req.query.likes === 'true' ? 1 : 0;

    const fetchStockData = ticker => {
      const quoteUrl = `${apiurl}${ticker}/quote`;
      return fetch(quoteUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => ({
          stock: data.symbol,
          price: data.latestPrice,
          ...(stocks.length > 1 ? { rel_likes: likes } : { likes })
        }));
    };

    const fetchPromises = stocks.map(fetchStockData);

    Promise.all(fetchPromises)
      .then(results => {
        // Return stockData as an object if there's only one stock, otherwise as an array
        res.json({ stockData: results.length === 1 ? results[0] : results });
      })
      .catch(error => {
        console.error('There was an error with the fetch operation:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
      });
  });
};