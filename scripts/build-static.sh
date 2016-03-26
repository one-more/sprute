#!/usr/bin/env bash

sudo truncate -s 0 ./nohup.out
sudo truncate -s 0 ./static/bundle-result.js

sudo nohup gulp 2> /dev/null &
#  check to see if it started correctly
GULP_RESULT="unknown"
REG="Finished 'default'"
while true; do
  if [[ $GULP_RESULT != "unknown" ]]; then
    break
  fi
  sleep 1
  # read in the file containing the std out of the pppd command
  #  and look for the lines that tell us what happened
  while read line; do
    if [[ $line =~ $REG ]]; then
      #echo "default finished------------------------------------------------------------"
      GULP_RESULT="success"
      break
    fi
    #echo "$line - output"
  done < <( sudo cat ./nohup.out )
done

sudo kill -9 `ps -auxww | grep gulp | grep -v grep | awk '{print $2}'`