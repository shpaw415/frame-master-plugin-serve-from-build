import type { FrameMasterConfig } from "frame-master/server/types";
import servefrombuild from "from-build";

export default {
	HTTPServer: {
		port: 3001,
	},
	pluginsOptions: {
		entrypoints: [
			"test-entrypoints/index.html",
			"test-entrypoints/sub/sub-route/index.html",
		],
	},
	plugins: [
		servefrombuild({
			buildDir: ".frame-master/build",
			plainURLPaths: ["index.html"],
		}),
	],
} satisfies FrameMasterConfig;
