import os
import sys

def search_repo(root_dir, search_term=None):
    # Directories to ignore
    ignore_dirs = {'.git', 'node_modules', '.agent', '.gemini', 'logs', '__pycache__', 'doc/images'}
    # Files to ignore
    ignore_files = {'.DS_Store'}

    found_matches = False
    
    # ANSI colors for better readability
    GREEN = '\033[92m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

    print(f"Scanning root: {root_dir}")
    print(f"Ignoring: {', '.join(ignore_dirs)}\n")

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Modify dirnames in-place to skip ignored directories
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]

        for filename in filenames:
            if filename in ignore_files:
                continue

            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)

            if search_term is None:
                # Mode 1: Just list files
                print(f"{CYAN}{rel_path}{RESET}")
            else:
                # Mode 2: Search content within files
                try:
                    # Attempt to read as UTF-8, ignore errors for binary/weird files
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            if search_term.lower() in line.lower(): # Case-insensitive search
                                print(f"{CYAN}{rel_path}{RESET}:{GREEN}{i+1}{RESET}: {line.strip()}")
                                found_matches = True
                except Exception as e:
                    # Skip files that can't be read
                    continue
    
    if search_term and not found_matches:
        print(f"\nNo matches found for '{search_term}'")

if __name__ == "__main__":
    # Assumes script is in /scripts/ and repo root is one level up
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    search_term = None
    if len(sys.argv) > 1:
        search_term = sys.argv[1]
        print(f"Searching for '{search_term}' in repository...")
    else:
        print("No search term provided. Listing all files...")
        
    search_repo(root_dir, search_term)
