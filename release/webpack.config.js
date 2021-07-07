const path = require('path');
const fs = require('fs');
const TerserPlugin = require("terser-webpack-plugin");

if (!fs.existsSync(path.join(process.cwd(), "./build"))) {
  fs.mkdirSync(path.join(process.cwd(), "./build"));
}

if (!fs.existsSync(path.join(process.cwd(), "./Tree.common.css"))) {
  fs.copyFileSync(path.join(process.cwd(), "./src/Tree.common.css"), path.join(process.cwd(), "./build/Tree.common.css"));
}
if (!fs.existsSync(path.join(process.cwd(), "./Tree.dark.css"))) {
  fs.copyFileSync(path.join(process.cwd(), "./src/Tree.dark.css"), path.join(process.cwd(), "./build/Tree.dark.css"));
}
if (!fs.existsSync(path.join(process.cwd(), "./Tree.light.css"))) {
  fs.copyFileSync(path.join(process.cwd(), "./src/Tree.light.css"), path.join(process.cwd(), "./build/Tree.light.css"));
}

const entries = { bundle: './src/index.ts' };

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    library: {
      name: 'jzo-components-tree',
      type: 'umd'
    }
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          // Added for profiling in devtools
          keep_classnames: true,
          keep_fnames: true,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        }
      })
    ]
  }
}
