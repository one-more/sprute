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
git rm "README.md"
git rm ".foreverignore"
git rm "mocha-bootstrap.js"
git rm --cached -r "scripts"
git rm -r "test"
git rm -r "tests-client"

./scripts/build-static.sh

git rm ./.gitignore

git mv ./.masterignore ./.gitignore

find ./static/images -name "*upload*" -type f -delete

git add static/*

git ci -m "release $version"
git push -u origin "release_$version"

git reset --hard origin/dev
git co dev

