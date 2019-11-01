# SEAP ESA Assessment

## Setting up

1. run `npm install`
2. `npm start` spins up a dev server to track any changes live
3. Build by running `npm run build`
4. This will create a **build** folder, with css, html and js files minified. Point your browser at the `index.html` file to test
5. `npm test` to run existing tests

## What everything is

* The master template is at `src/assessment.handlebars`. This is for building the single `index.html` assessment page in `build`
* The data context for this template is at `assessment-data.json`. The `questions` property is an array and is used to construct all the questions "slide" `<div>`s in index.html.
* `helpers` is where we define template helpers for the above. Eg. **sluggify.js** turns strings into alphanumeric slugs. Used like `{{sluggify string}}`
* `css` contains the master CSS file, `style.css` This is stored in the seap_core repository which is a dependency of this project. During development symlinks can be used to test style development. When deploying the css will need to be pushed to the seap_core repository in order to be upto date.*
* The applications scripts are in `js/scripts.js`. If you run `npm run build` the concatenated scripts will be minified

## Deploy procedure

__Staging__
* We are using Travis (.travis.yml) and Webpack to build test and deploy (deploy.sh)
* On EVERY push, pull request or merge Travis uses Webpack test task to run all _test.coffee and _test.js files in /tests
* If the tests pass, Travis commits the new build to gh-pages branch (our staging server) http://neontribe.github.io/seap_esa

__Live__
* When release is tagged and pushed
`git tag -a v0.0.0-beta -m "description of release updates"`
`git push origin --tags`
* Use Travis to carry out procedure as for Staging
* If tests pass, and build is successful, detect release tag and push the new build to the live site - overwriting whatever is there.
* A release.txt will be added at site root with tag name and datetime
