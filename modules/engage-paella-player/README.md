#DCE notes for Opencast Paella Player
====================================

## To do a local test:
---------------------
1. "npm install"
2. "gulp build"
3. Open a browser and go to "http://127.0.0.1:3000/engage/player/watch.html?id=ee39049c-05f0-4d2b-94b4-625ce59f1b2b&logLevel=DEBUG"

---------------------
---------------------
As of Sept 2019 the  github.com:harvard-dce/dce-paella-opencast is migrated here
to the modules/engage-paella-player.

The HUDCE extension plugins are still at 
- github.com:harvard-dce/dce-paella-extensions

## Customized Resources
The gulpfile has been customized to add DCE overrides to the vanilla Opencast files in this module.
The package.json identifies the source repositories and versions of UPV Paella, DCE custom plugins, and DCE overrides for Paella and Openast-Paella files.

- All Opencast player-paella module javascript/css/html overrides are in this repository
- All UPV Paella player javascript/css/html overrides are at [dce-paella-opencast paella_overrides](https://github.com/harvard-dce/dce-paella-opencast/tree/master/vendor/paella_overrides).

## Building the Jar for module deploy

To build with the pre-constructed dependencies: run `mvn clean install`
To build with updated developement dependencies: run `mvn clean install -DdevBuild`

## Development
--------------

### install the node dev depencencies
run `mvn clean install -DdevBuild` to install node module dependencies
If you have global node tools installed, that match the tool version from the pom, you can just run `npm install` 

### Build the dependencies
runt `gulp default`

### Running the server locally
run `gulp server`

### Developing on all dce-XYZ branches locally
In another directory, clone the dce-paella-extensions repository:
- github.com:harvard-dce/dce-paella-extensions

In dce-paella-extensions, run `npm link`
In this repository, run `npm link dce-paella-extensions`

When ready to build from the local branches, run `gulp build`
If `gulp server` has difficulty after linking the local dce-paella-opencast repo, it's test server config might need to moved to this repo.


 

