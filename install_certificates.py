#!/usr/bin/env python3
"""
This script installs the certifi certificates to the OpenSSL certificate directory.
This helps fix SSL certificate verification issues in Python applications.
"""
import os
import shutil
import certifi
import ssl

def main():
    # Get the certifi certificate path
    certifi_path = certifi.where()
    print(f"Certifi certificate path: {certifi_path}")
    
    # Get the OpenSSL certificate paths
    ssl_paths = ssl.get_default_verify_paths()
    print(f"OpenSSL certificate paths: {ssl_paths}")
    
    # Determine the target path
    target_paths = [
        ssl_paths.cafile,
        "/etc/ssl/cert.pem",
        "/etc/ssl/certs/ca-certificates.crt",
        os.path.expanduser("~/.ssl/cert.pem")
    ]
    
    # Try to copy to each target path
    for target_path in target_paths:
        if not target_path:
            continue
            
        target_dir = os.path.dirname(target_path)
        print(f"\nAttempting to copy certificates to: {target_path}")
        
        try:
            # Create directory if it doesn't exist
            if not os.path.exists(target_dir):
                os.makedirs(target_dir, exist_ok=True)
                print(f"Created directory: {target_dir}")
            
            # Copy the certificates
            shutil.copy2(certifi_path, target_path)
            print(f"Successfully copied certificates to: {target_path}")
            
            # Set environment variable
            print(f"You can set this environment variable to use these certificates:")
            print(f"export REQUESTS_CA_BUNDLE={target_path}")
            print(f"export SSL_CERT_FILE={target_path}")
            
        except (PermissionError, OSError) as e:
            print(f"Failed to copy to {target_path}: {e}")
            print("You may need to run this script with sudo for system directories.")
    
    # Create a user-specific certificate directory as a fallback
    user_cert_dir = os.path.expanduser("~/.ssl")
    user_cert_file = os.path.join(user_cert_dir, "cert.pem")
    
    try:
        if not os.path.exists(user_cert_dir):
            os.makedirs(user_cert_dir, exist_ok=True)
        
        shutil.copy2(certifi_path, user_cert_file)
        print(f"\nCreated user certificate file at: {user_cert_file}")
        print("You can use this by setting:")
        print(f"export REQUESTS_CA_BUNDLE={user_cert_file}")
        print(f"export SSL_CERT_FILE={user_cert_file}")
    except Exception as e:
        print(f"Failed to create user certificate file: {e}")
    
    print("\nTo make these changes permanent, add the export commands to your shell profile (~/.bash_profile, ~/.zshrc, etc.)")

if __name__ == "__main__":
    main()
