#Local Cuts Calculator

##Getting Started
- Install node to get started: https://nodejs.org/en/download/
- Run npm install in the directory to install dependencies.

##Using Gulp
- If you're not familiar with gulp, see this beginner's guide: https://css-tricks.com/gulp-for-beginners/
- There are several gulp tasks defined in gulpfile.js.
- The gulp task called 'less' will compile any less files in the less/compile folder to css and minified css and output them to the css folder.
- Front-end js is compiled using Webpack, with entry point js/entry.js and output js/bundle.js. Run the gulp 'watch-bundle' task while developing to compile the js.

##Tests
- Tests are written in Jasmine
- Tests are also compiled using Webpack; run the 'watch-test-bundle' gulp task while developing to compile the js.
- If adding specs, require them in the spec/entry.js file to add them to the test suite.
- Run npm test to start test server, then navigate to 127.0.0.1:8000/spec/SpecRunner.html to run tests.