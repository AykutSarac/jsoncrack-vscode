const fs = require('fs');
const path = require('path');

const PATHS_TO_COPY = [
    'features/editor/views/GraphView',
    'hooks',
    'store',
    'types',
    'constants',
    'enums',
    'lib/utils'
];

const SOURCE_ROOT = path.join(__dirname, '../jsoncrack/src');
const DEST_ROOT = path.join(__dirname, '../src/jsoncrack');

// Define paths to exclude (relative to source root)
const EXCLUDED_FILES = [
    'hooks/useJsonQuery.ts',
    'constants/seo.ts',
    'features/editor/views/GraphView/NotSupported.tsx',
    'store/useModal.ts',
    'lib/utils/generateType.ts'
];

// Function to copy directory recursively
function copyDir(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        // Get relative path from source root for comparison
        const relativePath = path.relative(SOURCE_ROOT, srcPath);

        // Skip excluded files by checking full relative path
        if (EXCLUDED_FILES.includes(relativePath)) {
            console.log(`Skipping excluded file: ${relativePath}`);
            return;
        }

        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Copy each path
PATHS_TO_COPY.forEach(relativePath => {
    const fullSrcPath = path.join(SOURCE_ROOT, relativePath);
    const fullDestPath = path.join(DEST_ROOT, relativePath);

    // Check if source directory exists
    if (!fs.existsSync(fullSrcPath)) {
        console.error(`Error: Source directory ${fullSrcPath} does not exist!`);
        process.exit(1);
    }

    // Create destination directory with full path structure
    if (!fs.existsSync(fullDestPath)) {
        fs.mkdirSync(fullDestPath, { recursive: true });
    }

    console.log(`Copying ${relativePath} folder...`);
    copyDir(fullSrcPath, fullDestPath);
    console.log(`Successfully copied ${relativePath} folder to ${fullDestPath}`);
});