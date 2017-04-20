# Local Cuts Calculator

## Getting Started
- Install node to get started: https://nodejs.org/en/download/
- Run npm install in the directory to install dependencies.

## Using Gulp
- If you're not familiar with gulp, see this beginner's guide: https://css-tricks.com/gulp-for-beginners/
- There are several gulp tasks defined in gulpfile.js.
- The gulp task called 'less' will compile any less files in the less/compile folder to css and minified css and output them to the css folder.
- Run 'watch-less' while developing to compile css as changes are made.
- Front-end js is compiled using Webpack, with entry point js/entry.js and output js/bundle.js. Run the gulp 'watch-bundle' task while developing to compile the js.

## Tests
- Tests are written in Jasmine.
- Tests are run by Karma with a Webpack preprocessor - details in ./karma.config.js
- To run tests once run npm test.
- For developing, npm install karma-cli -g and then run karma start in the app directory.