#!/bin/bash

if [ -f /.dockerenv ]; then
    echo "Running in Docker"
    # Use uv run to ensure we're using the virtual environment
    uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000 --reload &
    uv run python watcher.py &
    uv run taskiq worker app.tasks:broker
else
    echo "Running locally with uv"
    uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000 --reload &
    uv run python watcher.py &
    uv run taskiq worker app.tasks:broker
fi

wait
