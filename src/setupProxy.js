const { createProxyMiddleware } = require('http-proxy-middleware');

// Ist gleichwertig mit der Proxy-Konfig in package.json (proxy: "http://localhost:9292"),
// nur dass liblouis die Brailletabellen on demand laden kann. Der einfache Proxy
// verarbeitet nicht die HEAD Requests zur Bestimmung der Dateigröße.
module.exports = function(app) {
  app.use(
    '/api/cms',
    createProxyMiddleware({
      target: 'https://cms.tacpic.de/index.php/wp-json/wp/v2',
      logLevel: "debug",
      changeOrigin: true,
      pathRewrite: function (path) {
        return path.replace('/api/cms', '')
      },
      secure: false
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:9292',
      logLevel: "info",
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