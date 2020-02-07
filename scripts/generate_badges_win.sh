#!/bin/bash

export VERSION="$(cat package.json | node_modules/node-jq/bin/jq.exe -r '.version')";
badge version "$VERSION" :brightgreen .svg > .ci/npm-version-badge.svg

export NDEPENDENCIES="$(cat package.json | node_modules/node-jq/bin/jq.exe -r '.dependencies | length')";
badge dependencies "$NDEPENDENCIES" :green .svg > .ci/npm-dependencies-badge.svg

export NDEVDEPENDENCIES="$(cat package.json | node_modules/node-jq/bin/jq.exe -r '.devDependencies | length')";
badge devDependencies "$NDEVDEPENDENCIES" :orange .svg > .ci/npm-devdependencies-badge.svg