const { resolve } = require('node:path');
const webpack = require('@nativescript/webpack');
const { merge } = require('webpack-merge');

module.exports = env => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack
  webpack.chainWebpack(config => {
    config.resolve.extensions.add('.android.ts');
    config.resolve.extensions.add('.ios.ts');
    config.resolve.extensions.add('.ts');
    config.resolve.extensions.add('.android.tsx');
    config.resolve.extensions.add('.ios.tsx');
    config.resolve.extensions.add('.tsx');

    config.resolve.alias.set(
      '@nativescript/core',
      resolve(__dirname, '../../packages/platform-native/node_modules/@nativescript/core'),
    );
    config.resolve.alias.set('@dark-engine/core', resolve(__dirname, '../../packages/core/src'));
    config.resolve.alias.set('@dark-engine/platform-native', resolve(__dirname, '../../packages/platform-native/src'));
    config.resolve.alias.set(
      '@dark-engine/native-navigation',
      resolve(__dirname, '../../packages/native-navigation/src'),
    );
    config.resolve.alias.set('@dark-engine/animations', resolve(__dirname, '../../packages/animations/src'));
    config.resolve.alias.set('@dark-engine/data', resolve(__dirname, '../../packages/data/src'));

    config.module
      .rule('ts')
      .test(/\.(ts|tsx)$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        transpileOnly: true,
      });

    config.plugin('DefinePlugin').tap(args => {
      args[0] = merge(args[0], {
        __UI_USE_EXTERNAL_RENDERER__: true,
        __UI_USE_XML_PARSER__: false,
      });

      return args;
    });
  });

  const config = webpack.resolveConfig();

  return config;
};
