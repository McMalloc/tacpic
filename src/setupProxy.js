const { createProxyMiddleware } = require('http-proxy-middleware');

// Ist gleichwertig mit der Proxy-Konfig in package.json (proxy: "http://localhost:9292"),
// nur dass liblouis die Brailletabellen on demand laden kann. Der einfache Proxy
// verarbeitet nicht die HEAD Requests zur Bestimmung der Dateigröße.
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:9292',
      logLevel: "debug",
      pathRewrite: function (path) {
        return path.replace('/api', '/')
      }
    })
  );
  app.use(
    '/legal',
    createProxyMiddleware({
      target: 'http://localhost:9292',
      logLevel: "debug"
    })
  );
};