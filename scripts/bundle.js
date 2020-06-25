"use strict";

const defaultConfigContents = require("@parcel/config-default");
const Parcel = require("@parcel/core").default;
const { createWorkerFarm } = require("@parcel/core");

const config = {
  yep: {
    target: {
      includeNodeModules: true,
      outputFormat: "esmodule",
      isLibrary: true,
    },
    entry: "src/a-module.js",
    dest: "dist/main-bundle.js",
  },
  "optional-module": {
    target: {
      includeNodeModules: true,
      outputFormat: "esmodule",
      isLibrary: true,
    },
    entry: "src/stuff/optional-module.js",
    dest: "dist/optional.js",
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

// tasks = [
//   async () => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log(`waited: 1000ms`);
//   },
//   async () => {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     console.log(`waited: 500ms`);
//   },
// ];
