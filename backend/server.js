
const express = require('express');
const compression = require('compression');
const compressible = require('compressible');
const serveStatic = require('serve-static');
const app = express();

function shouldCompress(req, res) {
  const type = res.get("Content-Type");
  if (type === undefined || !compressible(type)) {
    return false;
  }
  return true;
}

app.use(compression({ filter: shouldCompress }));

const yes = require('yes-https');
app.use(yes());

// Serve current directory
app.use(serveStatic('.', {
  maxAge: 3600,
  setHeaders: (res, path) => {
    if (serveStatic.mime.lookup(path) === 'text/html') {
      // Custom Cache-Control for HTML files
      res.setHeader('Cache-Control', 'public, max-age=0')
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// If no request matches, send the index file
app.use((req, res, next) => {
  res.status(200).sendFile('index.html', { root: '.' });
});

const start = function (port) {  
  console.log(`Starting server..`)
  app.listen(port, () => console.log(`Server started at port ${port}`));
}

start(process.env.PORT || 8080);
