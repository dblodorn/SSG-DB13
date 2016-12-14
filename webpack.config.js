const path = require('path')
const webpack = require('webpack')
const WebpackShellPlugin = require('webpack-shell-plugin')
const merge = require('webpack-merge')
const TARGET = process.env.npm_lifecycle_event

const config = require('./config.json')

const PATHS = {
  app: path.join(__dirname, './src/_js/')
}

// Watch
const common = {
  entry: {
    app: ['./src/_js/index.js']
  },
  output: {
    path: path.resolve(__dirname, config.output + 'static/js/'),
    publicPath: config.output + 'static/js/',
    filename: 'app.js'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "stage-2"]
        },
        exclude: /node_modules/
      },
      {
        test: /\.sass|css$/,
        loaders: [
          "style",
          "css",
          "sass"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
};

// Build
if(TARGET === 'watch' || !TARGET) {
  module.exports = merge(common, {});
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.NoErrorsPlugin(),
    new WebpackShellPlugin({
      onBuildStart:[
        'echo "Webpack Run"'
      ],
      onBuildEnd:[
        // 'npm run deploy',
        'echo "Webpack Done"'
      ]
    })
  ])
}
