#!/usr/bin/env python3
"""
This script runs your application with SSL verification disabled.
It monkey patches the SSL verification in the requests library.

Usage:
python3 run_app_with_ssl_disabled.py your_script.py [args...]
"""
import sys
import os
import importlib.util
import warnings

# Disable SSL warnings
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Monkey patch the requests library to disable SSL verification
def patch_requests():
    try:
        import requests
        old_request = requests.Session.request
        
        def new_request(self, method, url, **kwargs):
            kwargs['verify'] = False
            return old_request(self, method, url, **kwargs)
        
        requests.Session.request = new_request
        print("Successfully patched requests library to disable SSL verification")
    except ImportError:
        print("Requests library not found, skipping patch")

# Monkey patch the SSL context creation
def patch_ssl():
    import ssl
    old_create_default_context = ssl.create_default_context
    
    def new_create_default_context(*args, **kwargs):
        context = old_create_default_context(*args, **kwargs)
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context
    
    ssl._create_default_https_context = new_create_default_context
    ssl.create_default_context = new_create_default_context
    print("Successfully patched SSL library to disable verification")

# Apply patches
patch_requests()
patch_ssl()

# Set environment variables
os.environ['PYTHONHTTPSVERIFY'] = '0'
os.environ['REQUESTS_CA_BUNDLE'] = ''
os.environ['SSL_CERT_FILE'] = ''

# Print warning
print("\n⚠️  WARNING: SSL certificate verification is disabled! ⚠️")
print("This is insecure and should only be used for development/testing.\n")

# Run the target script
if len(sys.argv) > 1:
    script_path = sys.argv[1]
    script_args = sys.argv[2:]
    
    print(f"Running script: {script_path} with args: {script_args}")
    
    # Load and run the script
    spec = importlib.util.spec_from_file_location("__main__", script_path)
    module = importlib.util.module_from_spec(spec)
    sys.argv = [script_path] + script_args
    spec.loader.exec_module(module)
else:
    print("Usage: python3 run_app_with_ssl_disabled.py your_script.py [args...]")
    sys.exit(1)
