#!/usr/bin/env bash

# This script will build the static patternlab styleguide and commit it into the
# `gh-pages` branch that can be deployed to the main repo for viewing at
# https://ilrwebservices.github.io/union/. The `gh-pages` branch is an orphan
# that is NOT part of the main branch history.

# While this script is as non-destructive as possible, generating the build
# in a dedicated worktree, it will still affect your repository. It is
# recommended to run this script in a dedicated build environment (e.g.
# Github Actions).

# Author: Jeff Amaral <jeff.amaral@cornell.edu>

# Requirements:
# - git (2.9 or later)
# - composer
# - npm

# Usage:
# $ ./build.sh [COMMIT HASH]

function error {
  echo
  echo "An error occurred in one of the commands in this script."
  exit $?
}
trap error ERR

# Switch to the repo root.
cd `git rev-parse --show-toplevel`

# Accept a commit hash as an argument, using HEAD as the default.
if [ -z "$1" ]
then
  COMMIT_HASH=`git rev-parse HEAD`
else
  COMMIT_HASH=$1
fi

# Ensure that the commit hash is valid.
if ! git rev-parse --quiet --verify $COMMIT_HASH^{commit}
then
  echo 'No such commit found.'
  exit 1
fi

# Configure git commit author info.
export GIT_AUTHOR_NAME="Build Script"
export GIT_AUTHOR_EMAIL="ilrweb@cornell.edu"
export GIT_COMMITTER_NAME=$GIT_AUTHOR_NAME
export GIT_COMMITTER_EMAIL=$GIT_AUTHOR_EMAIL

BUILD_DIR="/tmp/build-$COMMIT_HASH"
BUILD_BRANCH="build-$COMMIT_HASH"
BUILD_TAG="build-$COMMIT_HASH"
COMMIT_HASH_BRANCHES=`git branch --points-at $COMMIT_HASH`

# Create a new worktree directory for the build, and do the remaining tasks
# there. This will create a new branch that can be removed later.
git worktree add -b $BUILD_BRANCH $BUILD_DIR $COMMIT_HASH
cd $BUILD_DIR

# Clean up on exit.
function finish {
  echo
  echo "Cleaning up..."
  cd -
  git worktree remove --force $BUILD_DIR
  git branch -D $BUILD_BRANCH
}

trap finish EXIT

# Compile the styleguide: npm install, composer install, and npm run build
npm run setup
npm run build

# Automated tests would go here, and exit 0 on passing, non-zero on fail.

# Un-ignore the static build in the public/ directory by appending a negation to
# .gitignore.
cat <<EOT >> .gitignore

# Negate some ignored directories for a full build commit.
!/public/*
EOT

# Add and commit all build assets.
git add .
git commit --no-verify -m "Build of $COMMIT_HASH" -m "$COMMIT_HASH_BRANCHES"

# Filter the branch to move the `public/` directory contents to the repo root.
git filter-branch -f --prune-empty --subdirectory-filter public $BUILD_BRANCH

# Merge the filtered branch into `gh-pages`.
git checkout gh-pages
git merge --allow-unrelated-histories --strategy-option theirs -m "Merge build of $BUILD_BRANCH" $BUILD_BRANCH

echo 'gh-pages branch updated! Push to github to deploy (e.g. `git push origin gh-pages`).'

exit 0
