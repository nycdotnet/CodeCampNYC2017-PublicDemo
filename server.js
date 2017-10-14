var Hapi = require('hapi');
var Inert = require('inert');

var server = new Hapi.Server();
server.connection({ host: 'localhost', port: 3000 });
server.register(Inert, function () {});

server.route({
    path: '/',
    method: 'GET',
    handler: {
        file: 'public/index.html'
    }
});

var routeDirMap = {
  '/{path*}': './public',
  '/Scripts/Angular/{path*}': './node_modules/angular',
  '/Scripts/Bootstrap/{path*}': './node_modules/bootstrap/dist',
  '/Scripts/jQuery/{path*}': './node_modules/jquery/dist',
  '/Scripts/BootSwatchCosmo/{path*}': './BootSwatch/Cosmo',
  '/Scripts/big.js/{path*}': './node_modules/big.js',
  '/Scripts/qunitjs/{path*}': './node_modules/qunitjs/qunit'
};

for (var route in routeDirMap) {
  console.log("mapping directory " + routeDirMap[route] + " as route " + route);
  server.route({
      path: route,
      method: 'GET',
      handler: {
          directory: {
              path: routeDirMap[route],
              listing: false
          }
      }
  });
}

server.start(function () {
    console.log("Listening on " + server.info.uri);
});
