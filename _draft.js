// generate-sourcemaps
const projectConfig = ((args) => {
	if (!args.length) {
		return [];
	}

	let argsConfig = [];

	args.forEach(arg => {
		const argvEntry = arg.split('=');

		if (argvEntry.length < 2) {
			return [];
		}

		if (argvEntry[0] === '--project-config') {
			argsConfig = argvEntry[1].split(',');
		}
	});

	return argsConfig;
})(process.argv.slice(2))

const shouldGenerateSourcemaps = projectConfig.includes('generate-sourcemaps');
