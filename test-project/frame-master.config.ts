import type { FrameMasterConfig } from "frame-master/server/types";
import { getBuilder } from "frame-master/build";
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
			buildOnDevStart: true,
		}) as FrameMasterConfig["plugins"][number],
		{
			name: "test-plugin",
			version: "1.0.0",
			serverStart: {
				async dev_main() {
					await getBuilder()?.build();
				},
			},
		},
	],
} satisfies FrameMasterConfig;
