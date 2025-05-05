#!/bin/bash

# Start the backend service
cd /app/backend
uvicorn main:app --host 0.0.0.0 --port 5000 --workers 4 &

# Start the frontend service
cd /app/frontend
npm start &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $? 