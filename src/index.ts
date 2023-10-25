import { ImageAnnotatorClient } from '@google-cloud/vision';


const client = new ImageAnnotatorClient();

/**
 * Runs logo detection on the given list of file names and logs the description and average score of each logo.
 * @param fileNames - An array of file names to run logo detection on.
 * @returns void
 */
function main (fileNames: string[]): void {
    fileNames.forEach((fileName: string) => {
        console.log(`Running logo detection on ${fileName}`);
        client.logoDetection(fileName)
        .then(([result]) => {
            let scores: number[] = [];
            const logos = result.logoAnnotations;
            logos?.forEach((logo) => {
                if (logo.description)
                    console.log(`"${logo.description}" found in in file ${fileName}`);
                if (logo.score)
                    scores.push(logo.score);
            });
            const avg = scores.reduce((a, b) => a + b) / scores.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        })
        .catch((err) => {
            if (err.code === 'ENOENT')
                console.log(`File ${fileName} not found`);
        });
    });
}

main([
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
]);

// Implement the async version of the above here
// Your version should not use .then and should use try/catch instead of .catch
async function mainAsync(fileNames: string[]): Promise<void> {

    for (const fileName of fileNames) {
        console.log(`Running logo detection on ${fileName}`);
        
        try {
            const [result] = await client.logoDetection(fileName);
            
            let scores: number[] = [];
            const logos = result.logoAnnotations;

            logos?.forEach((logo) => {
                if (logo.description)
                    console.log(`"${logo.description}" found in file ${fileName}`);
                if (logo.score)
                    scores.push(logo.score);
            });

            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        } catch (err: any) {
            if (err.code === 'ENOENT')
                console.log(`File ${fileName} not found`);
            else 
                console.error(`Error processing ${fileName}: ${err.message}`);
        }
    }
    
}

mainAsync([
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
]);

// advantages of async/await against promises:
// 1. more readable: readability, conciseness
// 2. easier to debug, better stack traces
// 3. easier to write sequential code [loops and conditionals]