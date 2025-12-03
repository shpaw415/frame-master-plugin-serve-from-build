import type { FrameMasterPlugin } from "frame-master/plugin/types";
import { join } from "path";
import { version, name } from "./package.json";

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

function setBuildedFiles(outDir?: string) {
  if (!outDir)
    throw new Error(
      "No build directory specified please specify a 'buildDir' in the plugin options"
    );
  buildedFiles = Array.from(
    new Bun.Glob("**").scanSync({
      cwd: outDir,
      absolute: true,
      onlyFiles: true,
      dot: true,
      followSymlinks: false,
    })
  );
}

/**
 * serve-from-build - Frame-Master Plugin
 *
 * Description: Simply serves files from the build outputs.
 */
export default function servefrombuild(
  options: serveFromBuildOptions
): FrameMasterPlugin {
  return {
    name,
    version,
    router: {
      request: async (master) => {
        const filePath = buildedFiles.find((out) => {
          if (out === join(cwd, options.buildDir, master.URL.pathname))
            return true;
          if (!options.plainURLPaths) return false;
          for (const plainPath of options.plainURLPaths) {
            if (
              out ===
              join(cwd, options.buildDir, master.URL.pathname, plainPath)
            )
              return true;
          }
          return false;
        });
        if (!filePath) return;
        master.setResponse(Bun.file(filePath)).sendNow();
      },
    },

    build: {
      afterBuild() {
        setBuildedFiles(options?.buildDir);
      },
    },

    serverStart: {
      main() {
        setBuildedFiles(options?.buildDir);
      },
    },

    requirement: {
      frameMasterVersion: ">=2.1.0",
      bunVersion: ">=1.3.0",
    },
  };
}
