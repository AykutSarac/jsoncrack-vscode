import { readdirSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATHS_TO_COPY = [
    'features/editor/views/GraphView',
    'hooks',
    'store',
    'types',
    'constants',
    'enums',
    'lib/utils'
];

const SOURCE_ROOT = join(__dirname, '../jsoncrack/src');
const DEST_ROOT = join(__dirname, '../src/jsoncrack');

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
    const entries = readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        // Get relative path from source root for comparison
        const relativePath = relative(SOURCE_ROOT, srcPath);

        // Skip excluded files by checking full relative path
        if (EXCLUDED_FILES.includes(relativePath)) {
            console.log(`Skipping excluded file: ${relativePath}`);
            return;
        }

        if (entry.isDirectory()) {
            mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            copyFileSync(srcPath, destPath);
        }
    });
}

// Copy each path
PATHS_TO_COPY.forEach(relativePath => {
    const fullSrcPath = join(SOURCE_ROOT, relativePath);
    const fullDestPath = join(DEST_ROOT, relativePath);

    // Check if source directory exists
    if (!existsSync(fullSrcPath)) {
        console.error(`Error: Source directory ${fullSrcPath} does not exist!`);
        process.exit(1);
    }

    // Create destination directory with full path structure
    if (!existsSync(fullDestPath)) {
        mkdirSync(fullDestPath, { recursive: true });
    }

    console.log(`Copying ${relativePath} folder...`);
    copyDir(fullSrcPath, fullDestPath);
    console.log(`Successfully copied ${relativePath} folder to ${fullDestPath}`);
});