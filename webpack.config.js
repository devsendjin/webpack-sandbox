const Path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const config = require('./config');

const styleEntries = {
	'page-index': ['./scss/page-index.scss'],
};

module.exports = function (env, argv) {
  return {
    mode: config.MODE,
  	context: config.SOURCE_DIRECTORY,

    entry: {
    	bundle: ['./scss/bundle.scss', './bundle.js'],
    	...styleEntries,
    },

    output: {
      path: config.BUILD_DIRECTORY,
      filename: 'js/[name].js',
      publicPath: '/',
      sourceMapFilename: `sourcemaps/[name][ext].map`, // works only if devtool='source-map'
    },

    devtool: config.__DEV__ ? 'source-map' : false,

    target: 'web',

		module: {
			rules: [
				{
					test: /\.scss$/,
					use: [
						{ loader: MiniCssExtractPlugin.loader },
						{ loader: 'css-loader' },
				    {
				      loader: 'postcss-loader',
				      options: {
				        postcssOptions: {
				          plugins: [autoprefixer, ['postcss-preset-env', { stage: 2 }]],
				        },
				      },
				    },
						{ loader: 'sass-loader' },
					]
				},
			],
		},

    plugins: [
	    new MiniCssExtractPlugin({
	      filename: 'css/[name].css',
	      chunkFilename: 'css/[name].css',
	    }),
	    !config.isEmptyObject(styleEntries) && new config.GeneratedFilesFilterPlugin([config.createExcludedFilesRegexp(styleEntries)]),
    ].filter(Boolean),
	}
};
