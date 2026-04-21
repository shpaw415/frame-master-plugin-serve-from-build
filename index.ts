import { join } from "node:path";
import { getBuilder } from "frame-master/build";
import type { FrameMasterPlugin } from "frame-master/plugin/types";
import { name, version } from "./package.json";

export type serveFromBuildOptions = {
	/**
	 * The directory where your build outputs are located
	 */
	buildDir: string;
	/**
	 * Optional: Files to try when a directory is requested
	 *
	 * e.g., requesting "/about" will try "/about/index.html"
	 * @example: ["index.html", "index.js"] // would fit `/path` => `/path/index.html` | `/path/index.js`   */
	plainURLPaths?: Array<string>;
};

const cwd = process.cwd();

let buildedFiles: Array<string> = [];

function setBuildedFilesFromBuild(
	config: Bun.BuildConfig,
	outputs: Bun.BuildOutput,
) {
	if (!outputs)
		throw new Error(
			"No build directory specified please specify a 'buildDir' in the plugin options",
		);
	const buildDir = join(cwd, config.outdir as string);
	buildedFiles = outputs.outputs.map((out) => out.path.replace(buildDir, ""));
	console.log("Builded files:", buildedFiles);
}

/**
 * serve-from-build - Frame-Master Plugin
 *
 * Description: Simply serves files from the build outputs.
 */
export default function servefrombuild(
	options: serveFromBuildOptions,
): FrameMasterPlugin {
	return {
		name,
		version,
		router: {
			request: async (master) => {
				const filePath = buildedFiles.find((out) => {
					if (out === master.URL.pathname) return true;
					if (
						options.plainURLPaths?.find(
							(plainPath) => join(master.URL.pathname, plainPath) === out,
						)
					)
						return true;
					return false;
				});
				if (!filePath) return;

				master
					.setResponse(
						Bun.file(
							join(getBuilder()?.getConfig()?.outdir as string, filePath),
						),
					)
					.sendNow();
			},
		},

		build: {
			afterBuild(config, outputs) {
				setBuildedFilesFromBuild(config, outputs);
			},
		},

		requirement: {
			frameMasterVersion: ">=2.1.0",
			bunVersion: ">=1.3.0",
		},
	};
}
