#!/bin/bash

npm run generate-client

npm run dev &

node watcher.js

wait

