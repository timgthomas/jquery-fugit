const watchify = require('broccoli-watchify');
const babel = require('broccoli-babel-transpiler');
const compileSass = require('broccoli-sass');
const autoprefixer = require('broccoli-autoprefixer');
const merge = require('broccoli-merge-trees');
const env = require('broccoli-env').getEnv();

let js = 'src';
js = babel(js, {
presets: [ [ 'env', {
    targets: {
      browsers: [ 'last 2 versions' ]
    }
  } ] ],
  sourceType: 'module',
});
js = watchify(js, {
  browserify: {
    entries: [ './index.js' ],
  },
  outputFile: 'jquery.fugit.js',
});

let css = compileSass([ 'src/styles' ], 'fugit.scss', 'jquery.fugit.css');
css = autoprefixer(css);

let output = merge([ js, css ]);

if (env === 'development') {
  output = merge([ output, '.' ]);
}

module.exports = output;
