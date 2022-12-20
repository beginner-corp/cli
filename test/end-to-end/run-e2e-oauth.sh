#! /bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BEGIN_CLI=$SCRIPT_DIR/../../src/index.js

# Shut down subprocesses when tests done
trap 'kill -SIGTERM 0' EXIT

# Cleanup
rm -rf $SCRIPT_DIR/mock/tmp-mock
rm $SCRIPT_DIR/sandbox-output.tmp.txt
# Generate new project
node $BEGIN_CLI new $SCRIPT_DIR/mock/tmp-mock 
cd $SCRIPT_DIR/mock/tmp-mock 
node $BEGIN_CLI generate auth 
# Start project sandbox
(npx sandbox  | tee $SCRIPT_DIR/sandbox-output.tmp.txt) &
cd $SCRIPT_DIR 

# Test login with magic link
npx playwright test get-magiclink.spec.js 
sleep 1
magiclink=$(grep "Login Link:" $SCRIPT_DIR/sandbox-output.tmp.txt | tail -1 | sed 's/Login Link:  //')
PLAYWRIGHT_MAGICLINK=$magiclink npx playwright test use-magiclink.spec.js 

# Test login with magic link
npx playwright test get-allow-list-link.spec.js 
sleep 1
# TODO: if no link found it will get the previous link
hardcodedmagiclink=$(grep "Login Link:" $SCRIPT_DIR/sandbox-output.tmp.txt | tail -1 | sed 's/Login Link:  //' )
PLAYWRIGHT_MAGICLINK=$hardcodedmagiclink npx playwright test use-allow-list-link.spec.js 


# Test signup for new account
npx playwright test request-signup.spec.js 
sleep 1
# TODO: if no link found it will get the previous link
signupmagiclink=$(grep "Login Link:" $SCRIPT_DIR/sandbox-output.tmp.txt | tail -1 | sed 's/Login Link:  //' )
# TODO: Short circuit if no signup link is sent
# if [ "$signupmagiclink"="$magiclink" ] 
# then
#   echo "No Signup Link Found"
#   exit 1 # Fail if no link found
# fi
PLAYWRIGHT_MAGICLINK=$signupmagiclink npx playwright test complete-signup.spec.js 


exit
