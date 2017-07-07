

```bash
git clone git@github.com:jeromefarnum/bnea-duel-pw.git
cd bnea-duel-pw
npm install
npm start
```

Features | Tools Used
------ | -----
**CSS** | [Sass](http://sass-lang.com/) ([Libsass](http://sass-lang.com/libsass) via [node-sass](https://github.com/sass/node-sass)), [Autoprefixer](https://github.com/postcss/autoprefixer), [CSSNano](https://github.com/ben-eb/cssnano), Source Maps
**HTML** | [Nunjucks](https://mozilla.github.io/nunjucks/)
**Images** | Compression with [imagemin](https://www.npmjs.com/package/gulp-imagemin)
**Fonts** | Folder and `.sass` mixin for including WebFonts
**Live Updating** | [BrowserSync](http://www.browsersync.io/)
**Production Builds** | JS and CSS are [uglified](https://github.com/terinjokes/gulp-uglify) and [minified](http://cssnano.co/), [file size reporting](https://github.com/jaysalvat/gulp-sizereport), local production [Express](http://expressjs.com/) server for testing builds.

## Usage
Make sure Node installed. I recommend using [NVM](https://github.com/creationix/nvm) to manage versions. 

#### Install Dependencies
```bash
npm install
```

#### Run development tasks:
```bash
npm start
```

Aliases: `npm run gulp`, `npm run development`

This is where the magic happens. The perfect front-end workflow. This runs the default gulp task, which starts compiling, watching, and live updating all our files as we change them. BrowserSync will start a server on port 3000, or do whatever you've configured it to do. You'll be able to see live changes in all connected browsers. Don't forget about the additional BrowserSync tools available on port 3001!

Why run this as an npm script? NPM scripts add ./node_modules/bin to the path when run, using the packages version installed with this project, rather than a globally installed ones. Never `npm install -g` and get into mis-matched version issues again. These scripts are defined in the `scripts` property of `package.json`.


#### Build production files:
```bash
npm run production
```

#### Build production files and launch server:
```bash
npm run demo
```

## Configuration
Directory and top level settings are convienently exposed in `gulpfile.js/config.json`. Use this file to update paths to match the directory structure of your project, and to adjust task options.

All task configuration objects have `src` and `dest` directories specfied. These are relative to `root.src` and `root.dest` respectively. Each configuration also has an extensions array. This is used for file watching, and file deleting/replacing.

**If there is a feature you do not wish to use on your project, simply delete the configuration, and the task will be skipped.**

Not all configuration is exposed here. For advanced task configuration, you can always edit the tasks themselves in `gulpfile.js/tasks`.

### Start compiling, serving, and watching files
```bash
npm run gulp
```

(or `npm run development`)

This runs `gulp` from `./node_modules/bin`, using the version installed with this project, rather than a globally installed instance. All commands in the package.json `scripts` work this way. The `gulp` command runs the `default` task, defined in `gulpfile.js/tasks/default.js`.

All files will compile in development mode (uncompressed with source maps). [BrowserSync](http://www.browsersync.io/) will serve up files to `localhost:3000` and will stream live changes to the code and assets to all connected browsers. Don't forget about the additional BrowserSync tools available on `localhost:3001`!

To run any other existing task, simply add the task name after the `gulp` command. Example:

```bash
npm run gulp production
```

## Asset Task Details
A `README.md` with details about each asset task are available in their respective folders in the `src` directory:

- [JavaScript](src/javascripts)
- [Stylesheets](src/stylesheets)
- [HTML](src/html)
- [Fonts](src/fonts)
- [Images](src/images)
- [Static Files (favicons, app icons, etc.)](src/static)

## Additional Task Details

### Build production-ready files
```bash
npm run production
```

This will compile revisioned and compressed files to `./public`. To build production files and preview them localy, run

For non-static sites (Rails, Craft, etc.), make sure the `production` task runs as part of your deploy process.