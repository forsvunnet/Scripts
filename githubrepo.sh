#!/bin/sh
if [ "$#" = "3" ]
then
  echo "Attempting to create repo $2 for $1"
  curl -u "$1" https://api.github.com/user/repos -d "{\"name\":\"$2\"}" >>\
  ~/Documents/logs/github.log
  echo "Done"
elif [ "$#" = "2" ]
then
  echo "Attempting to create repo $2 for $1 and adding remote"
  curl -u "$1" https://api.github.com/user/repos -d '{"name":"$2"}' >>\
  ~/Documents/logs/github.log &&\
  git remote add origin "git@github.com:$1/$2.git"
  echo "Done"
else
  echo "Usage : usr pass repo [no_remote=true]"
fi
#git push origin master