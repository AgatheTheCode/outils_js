import path from 'path';
import {globby} from 'globby';
import fs from 'fs/promises';
import {minify as terserMinify} from 'terser';

async function minifyJs() {
    const inputPattern = ['../../plugins/**/assets/script/**/*.js', '!../../plugins/**/assets/script/**/*.min.js'];

    try {
        const filePaths = await globby(inputPattern);

        console.log('Minifying the following files:', filePaths);

        await Promise.all(filePaths.map(async (inputFilePath) => {
            const inputFileContent = await fs.readFile(inputFilePath, 'utf-8');

            const outputDirectory = path.dirname(inputFilePath);
            const baseName = path.basename(inputFilePath, path.extname(inputFilePath));
            const outputMinFilePath = path.join(outputDirectory, `${baseName}.min.js`);

            console.log('outputMinFilePath', outputMinFilePath);

            console.log('Minifying file:', inputFilePath);

            const options = {
                compress: true,
                mangle: true,
            };

            const minifiedCode = await terserMinify(inputFileContent, options);

            if (minifiedCode.error) {
                throw new Error(`Minification error: ${minifiedCode.error}`);
            }

            // Check if the file exists before attempting to delete
            const exists = await fs.access(outputMinFilePath).then(() => true).catch(() => false);

            if (exists) {
                try {
                    await fs.unlink(outputMinFilePath);
                    console.log(`Deleted existing minified file: ${outputMinFilePath}`);
                } catch (deleteError) {
                    console.error(`Error deleting existing file: ${deleteError}`);
                }
            }

            try {
                await fs.writeFile(outputMinFilePath, minifiedCode.code.toString(), 'utf-8');
                console.log(`Minification successful for ${inputFilePath}`);
            } catch (writeError) {
                throw new Error(`Error writing minified file: ${writeError}`);
            }
        }));

        console.log('Minification successful for all files');
    } catch (error) {
        console.error('Error:', error);
    }
}

minifyJs();