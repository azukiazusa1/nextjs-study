#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

git diff HEAD^ HEAD --quiet .

if [[ "$VERCEL_GIT_COMMIT_REF" == "gh-pages"  ]] ; then
 # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
else
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
fi