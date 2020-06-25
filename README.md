# Example using parcel 2 beta programatically

## About

This is a demo of attempting to use parcel@2.0.0-beta.1 to programatically bundle a portion of a project.

Check `scripts/bundle.js` for setup. Note that `package.json` has a `main` property.

## Getting started

- `npm install`
- `npm run bundle`

Note that no files have been output to the `dist` directory. Instead the file `src/index.js` has been overwritten with bundle output.

My desired behaviour is for each bundle to be output to the `dist` directory. Ideally I'd be able to choose the name for each bundle. No files in the `src` directory should be modified by Parcel.
