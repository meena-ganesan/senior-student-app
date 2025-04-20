#!/bin/bash
# This script runs your application with SSL verification disabled
# WARNING: This is not secure for production use

# Disable SSL verification
export PYTHONHTTPSVERIFY=0
export REQUESTS_CA_BUNDLE=""

# Run your application (replace with your actual command)
python3 your_application.py

# Note: You can also run a specific command like this:
# PYTHONHTTPSVERIFY=0 python3 your_application.py
