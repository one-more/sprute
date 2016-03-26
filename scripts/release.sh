#!/usr/bin/env bash

OPTIND=1
version='0.0.0'

while getopts ":v:" opt; do
    case "$opt" in
    v)
        version=$OPTARG
    ;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        exit 1
    ;;
    esac
done

shift $((OPTIND-1))

echo "creating release branch with version $version"

git co -b "release_$version" origin/dev
git rm "TODO.md"
#git rm "README.md"
git rm ".foreverignore"
git rm "configuration/connections.js"
git rm "mocha-bootstrap.js"
git rm -r "scripts"
git rm -r "test"
git rm -r "tests-client"

./scripts/build-static.sh

git rm ./.gitignore

git mv ./.masterignore ./.gitignore

find ./static/images -name "*upload*" -type f -delete

git add static/*

git co origin/master README.md

#delete tag if exists
git tag -d "v$version"

git ci -m "release $version"
git tag -a "v$version" -m "version $version"

git fetch --all
git co master
git pull --rebase
git merge --no-ff "release_$version"

git branch -D "release_$version"

git push --tags

git push origin master

git reset --hard origin/dev
git co dev

sudo chmod -R 777 .

