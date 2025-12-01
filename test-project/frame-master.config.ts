import type { FrameMasterConfig } from "frame-master/server/types";
import servefrombuild from "..";

export default {
  HTTPServer: {
    port: 3001,
  },
  plugins: [
    servefrombuild({
      buildDir: ".frame-master/build",
      plainURLPaths: ["index.html"],
    }),
    {
      name: "set-entrypoints",
      version: "0.1.0",
      build: {
        buildConfig: {
          entrypoints: [
            "test-entrypoints/index.html",
            "test-entrypoints/sub/sub-route/index.html",
          ],
          outdir: ".frame-master/build",
        },
      },
    },
  ],
} satisfies FrameMasterConfig;
