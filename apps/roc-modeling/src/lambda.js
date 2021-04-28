const awsServerlessExpress = require('aws-serverless-express');
const server = require('../../../dist/roc-modeling/serverless/main');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
  'image/x-icon',
  'image/svg+xml',
  'application/x-font-ttf',
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
];
server.app.use(awsServerlessExpressMiddleware.eventContext());
const serverProxy = awsServerlessExpress.createServer(
  server.app,
  null,
  binaryMimeTypes
);
module.exports.handler = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }
  return awsServerlessExpress.proxy(serverProxy, event, context);
};
