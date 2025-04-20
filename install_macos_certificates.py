#!/usr/bin/env python3
"""
This script installs the macOS certificates for Python.
It's specifically designed to fix SSL certificate issues on macOS.
"""
import os
import subprocess
import sys

def main():
    print("Installing certificates for macOS Python...")
    
    # Check if we're on macOS
    if sys.platform != 'darwin':
        print("This script is only for macOS. Exiting.")
        return
    
    # Find the certificate command
    cert_command = '/Applications/Python 3.9/Install Certificates.command'
    if not os.path.exists(cert_command):
        cert_command = '/Applications/Python 3.10/Install Certificates.command'
    
    if not os.path.exists(cert_command):
        cert_command = '/Applications/Python 3.11/Install Certificates.command'
    
    if not os.path.exists(cert_command):
        print("Could not find the Install Certificates.command script.")
        print("Trying alternative method...")
        
        try:
            # Alternative method: run the certifi command directly
            import certifi
            import ssl
            
            print(f"Current certifi path: {certifi.where()}")
            print(f"Current SSL paths: {ssl.get_default_verify_paths()}")
            
            # Try to run the macOS certificate installation
            subprocess.run([
                sys.executable, 
                "-m", "pip", 
                "install", 
                "--upgrade", 
                "certifi"
            ], check=True)
            
            # Create a symlink to the system certificates
            cert_file = '/tmp/cacert.pem'
            subprocess.run([
                'security', 
                'find-certificate', 
                '-a', 
                '-p', 
                '/System/Library/Keychains/SystemRootCertificates.keychain'
            ], stdout=open(cert_file, 'w'), check=True)
            
            print(f"Created certificate file at {cert_file}")
            print(f"You can use this by setting:")
            print(f"export SSL_CERT_FILE={cert_file}")
            print(f"export REQUESTS_CA_BUNDLE={cert_file}")
            
        except Exception as e:
            print(f"Alternative method failed: {e}")
            print("Please try running the Install Certificates.command script manually.")
        
        return
    
    print(f"Found certificate installation script at: {cert_command}")
    print("Running the certificate installation script...")
    
    try:
        subprocess.run(['bash', cert_command], check=True)
        print("Certificate installation completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Certificate installation failed: {e}")
        print("You may need to run the script manually with sudo.")

if __name__ == "__main__":
    main()
