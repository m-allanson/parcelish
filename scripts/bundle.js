"use strict";

const defaultConfigContents = require("@parcel/config-default");
const Parcel = require("@parcel/core").default;
const { createWorkerFarm } = require("@parcel/core");

const config = {
  core: {
    target: {
      includeNodeModules: true,
      outputFormat: "esmodule",
      isLibrary: true,
      distDir: "dist",
    },
    entry: "src/core.js",
    dest: "dist/main-bundle.js",
  },
  "syntax-a": {
    target: {
      includeNodeModules: true,
      outputFormat: "esmodule",
      isLibrary: true,
      distDir: "dist",
    },
    entry: "src/syntaxes/syntax-a.js",
    dest: "dist/syntax-a.js",
  },
  "syntax-b": {
    target: {
      includeNodeModules: true,
      outputFormat: "esmodule",
      isLibrary: true,
      distDir: "dist",
    },
    entry: "src/syntaxes/syntax-b.js",
    dest: "dist/syntax-b.js",
  },
  // etc...
};

let tasks = [];
let workerFarm = createWorkerFarm();

for (const module in config) {
  let task = async () => {
    let bundler = new Parcel({
      entries: config[module].entry,
      target: config[module].target,
      defaultConfig: {
        ...defaultConfigContents,
        filePath: require.resolve("@parcel/config-default"),
      },
      defaultEngines: {
        browsers: ["> 0.25%"],
      },
      disableCache: true,
      isLibrary: true,
      logLevel: "warn",
      minify: false,
      mode: "production",
      outputFormat: "esmodule",
      patchConsole: false,
      workerFarm,
    });

    await bundler.run();
  };

  tasks.push([module, task]);
}

(async () => {
  try {
    for (const [module, task] of tasks) {
      await task();
      console.log(`bundled ${module}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await workerFarm.end();
  }
})();
