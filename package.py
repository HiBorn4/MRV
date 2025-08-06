import os
import re
import subprocess
import sys

def find_python_files(directory):
    py_files = []
    for root, _, files in os.walk(directory):
        for f in files:
            if f.endswith(".py"):
                py_files.append(os.path.join(root, f))
    return py_files

def extract_imports_from_file(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Regular expressions to capture import and from-import
    import_lines = re.findall(r'^\s*(?:import|from)\s+([a-zA-Z0-9_\.]+)', content, re.MULTILINE)
    return set([line.split('.')[0] for line in import_lines])  # Top-level package only

def install_packages(packages):
    for package in packages:
        try:
            print(f"📦 Installing: {package}")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install: {package}")

def main():
    target_dir = "."  # Change to your target directory
    print(f"🔍 Scanning Python files in: {os.path.abspath(target_dir)}")

    py_files = find_python_files(target_dir)
    all_imports = set()

    for file in py_files:
        print(f"→ Analyzing: {file}")
        imports = extract_imports_from_file(file)
        all_imports.update(imports)

    # Remove standard library packages (optional, basic heuristic)
    std_libs = {
        'os', 'sys', 're', 'json', 'math', 'datetime', 'time', 'random', 'typing',
        'subprocess', 'logging', 'pathlib', 'itertools', 'functools', 'collections',
        'http', 'urllib', 'base64', 'csv', 'threading', 'shutil'
    }
    external_packages = all_imports - std_libs

    print("\n📦 Packages to install:")
    print(external_packages)

    install_packages(external_packages)

if __name__ == "__main__":
    main()
