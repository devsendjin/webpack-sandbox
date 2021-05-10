const Path = require('path');

const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;

// MODE config
const MODE =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const __DEV__ = MODE === 'development';
const __PROD__ = MODE === 'production';

/**
 * Creating regular expressions to exclude generating unnecessary files
 * @param  {Object.<string, string | Array<string>>} entries input object
 * @return {RegExp} string of regexp
 */
const createExcludedFilesRegexp = (entries) => {
	const regexPattern = Object.entries(entries).reduce((acc, [entryName], index) => {
		if (index === 0) {
			acc = acc.concat(entryName);
			return acc;
		}
		acc = acc.concat(`|${entryName}`);
		return acc;
	}, '');
	return new RegExp(`(${regexPattern})\.js`, 'gi');
};

class GeneratedFilesFilterPlugin {
	constructor(patterns) {
		this.patterns = patterns;
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
			Object.keys(compilation.assets)
				.filter(asset => {
					let match = false;
					let i = this.patterns.length;
					while (i--) {
						if (this.patterns[i].test(asset)) {
							match = true;
						}
					}
					return match;
				}).forEach(asset => {
					delete compilation.assets[asset];
				});

			callback();
		});
	}
}

module.exports = {
	// paths
	SOURCE_DIRECTORY: Path.resolve(process.cwd(), 'src'),
	BUILD_DIRECTORY: Path.resolve(process.cwd(), 'build'),

	// modes
	MODE,
	__DEV__,
	__PROD__,

	// utils && plugins
	isEmptyObject,
	createExcludedFilesRegexp,
	GeneratedFilesFilterPlugin,
};
