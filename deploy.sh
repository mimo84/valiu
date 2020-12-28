#!/bin/sh

git subtree push --prefix server heroku-server main
git subtree push --prefix client heroku-client main