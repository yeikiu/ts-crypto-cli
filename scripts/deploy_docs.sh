#!/bin/bash

# build docs
yarn docs

cp .ci_badges docs/.ci_badges

# navigate into the build output directory
cd docs

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy:site'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/yeikiu/ts-kraken-api.git master:gh-pages

read -p "Press any key to continue..." x
