#!/usr/bin/env python3
import os
import ssl
import certifi
import requests

# Print certificate information
print(f"Certifi path: {certifi.where()}")
print(f"SSL default verify paths: {ssl.get_default_verify_paths()}")

# Try to make a request with certificate verification
try:
    response = requests.get("https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken", verify=True)
    print(f"Request with verification succeeded: {response.status_code}")
except requests.exceptions.SSLError as e:
    print(f"Request with verification failed: {e}")

# Try to make a request without certificate verification (not recommended for production)
try:
    response = requests.get("https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken", verify=False)
    print(f"Request without verification succeeded: {response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"Request without verification failed: {e}")

# Create a temporary environment variable to disable verification
print("\nTo temporarily disable SSL verification in your application, you can use:")
print("export PYTHONHTTPSVERIFY=0")
print("export REQUESTS_CA_BUNDLE=/etc/ssl/cert.pem  # Or another path to a valid CA bundle")
print("\nFor a more permanent solution, update your Python SSL certificates.")
