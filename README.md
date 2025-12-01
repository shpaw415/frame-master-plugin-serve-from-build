# frame-master-plugin-serve-from-build

A **Frame-Master** plugin that serves static files directly from your build output directory. It acts as a static file server for your built assets, with support for clean URLs (e.g., serving `index.html` for directory roots).

## Features

- 🚀 **Zero Config Static Serving**: Automatically serves files from your specified build directory.
- 🔗 **Clean URL Support**: Map directory requests (like `/about`) to specific files (like `/about/index.html`).
- ⚡ **Bun Native**: Uses `Bun.file()` for high-performance static asset delivery.
- 🔄 **Build Aware**: Automatically updates the file list after a build completes.

## Installation

```bash
bun add frame-master-plugin-serve-from-build
```

## Usage

Add the plugin to your `frame-master.config.ts`:

```typescript
import type { FrameMasterConfig } from "frame-master/server/types";
import servefrombuild from "frame-master-plugin-serve-from-build";

const config: FrameMasterConfig = {
  HTTPServer: { port: 3000 },
  plugins: [
    servefrombuild({
      // The directory where your build outputs are located
      buildDir: ".frame-master/build",

      // Optional: Files to try when a directory is requested
      // e.g., requesting "/about" will try "/about/index.html"
      plainURLPaths: ["index.html"],
    }),
  ],
};

export default config;
```

## Configuration Options

| Option          | Type       | Required | Description                                                                                |
| --------------- | ---------- | -------- | ------------------------------------------------------------------------------------------ |
| `buildDir`      | `string`   | **Yes**  | The relative path to your build output directory (e.g., `".frame-master/build"`).          |
| `plainURLPaths` | `string[]` | No       | A list of filenames to append to directory requests. Useful for SPA routing or clean URLs. |

### Example: Clean URLs

If you have a file structure like:

```
build/
  about/
    index.html
  contact.html
```

With `plainURLPaths: ["index.html"]`:

- Requesting `/about` -> serves `build/about/index.html`
- Requesting `/contact.html` -> serves `build/contact.html`

## License

MIT
