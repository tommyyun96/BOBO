var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'build'), {
  repo: 'https://github.com/tommyyun96/BOBO.git'
});