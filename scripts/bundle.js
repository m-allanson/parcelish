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
};

let tasks = [];
let workerFarm = createWorkerFarm();

for (const module in config) {
  let task = async () => {
    let bundler = new Parcel({
      defaultConfig: {
        ...defaultConfigContents,
        filePath: require.resolve("@parcel/config-default"),
      },
      defaultEngines: {
        browsers: ["> 0.25%"],
      },
      disableCache: true,
      entries: config[module].entry,
      isLibrary: true,
      logLevel: "warn",
      minify: false,
      mode: "production",
      outputFormat: "esmodule",
      patchConsole: false,
      target: config[module].target,
      workerFarm,
    });

    await bundler.run();
  };

  tasks.push([module, task]);
}

(async () => {
  try {
    for (const [name, fn] of tasks) {
      await fn();
      console.log(`bundled ${name}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await workerFarm.end();
  }
})();
