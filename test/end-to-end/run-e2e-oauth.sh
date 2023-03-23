#! /bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BEGIN_CLI=$SCRIPT_DIR/../../src/index.js
MOCK_DIR=$SCRIPT_DIR/mock/tmp-mock-oauth
OUTPUT=$SCRIPT_DIR/sandbox-output-oauth.tmp.txt

# Shut down subprocesses when tests done
trap 'kill -SIGTERM 0' EXIT

# Cleanup
rm -rf $MOCK_DIR
rm $OUTPUT
# Generate new project
node $BEGIN_CLI new $MOCK_DIR
cd $MOCK_DIR
node $BEGIN_CLI generate auth -t oauth
# Start project sandbox
(npx sandbox  | tee $OUTPUT) &
cd $SCRIPT_DIR 

# Test login with oauth
npx playwright test oauth.spec.js 
sleep 1


exit
