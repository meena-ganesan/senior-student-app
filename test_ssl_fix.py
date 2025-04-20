#!/usr/bin/env python3
import requests
import sys

# URL that was failing before
url = "https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken"

try:
    print(f"Attempting to connect to {url} with SSL verification...")
    response = requests.get(url, verify=True)
    print(f"Success! Status code: {response.status_code}")
    print(f"Response size: {len(response.content)} bytes")
    print("SSL certificate verification is working correctly!")
    sys.exit(0)
except requests.exceptions.SSLError as e:
    print(f"SSL Error: {e}")
    print("\nThe SSL certificate verification is still failing.")
    print("Try setting these environment variables before running your application:")
    print("export SSL_CERT_FILE=/Users/meena.ganesan/.ssl/cert.pem")
    print("export REQUESTS_CA_BUNDLE=/Users/meena.ganesan/.ssl/cert.pem")
    sys.exit(1)
