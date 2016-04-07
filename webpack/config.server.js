import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

import { Dir } from '~/config';

// keep node_module paths out of the bundle
function removeNodeModules() {
  return fs
    .readdirSync(Dir.modules)
    .concat(['react-dom/server'])
    .reduce((ext, mod) => {
      ext[mod] = ['commonjs', mod].join(' ');
      return ext;
    }, {});
}

export function load() {
  return {
    target: 'node',
    entry: [
      'babel-polyfill',
      path.join(Dir.root, 'server.js'),
    ],
    output: {
      path: Dir.root,
      filename: 'server.bundle.js',
    },
    externals: removeNodeModules(),
    node: {
      __filename: true,
      __dirname: true,
    },
    plugins: [
      new webpack.ProvidePlugin({ Promise: 'bluebird' }),
      new webpack.DefinePlugin({
        'global.CLIENT': JSON.stringify(false),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
  };
}
