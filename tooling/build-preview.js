'use strict';

import { promisify } from 'util';
import child_process from 'child_process';
import fs from 'fs'

const exec = promisify(child_process.exec)

try {
    console.log('beginning site build processes');
    const buildPromises = [
        exec('npm run build:html')
    ];
    await Promise.all(buildPromises);
    console.log('SUCCESS -- site preview ');
    
    try {
        fs.unlink('./.eleventyignore', function (err) {            
            if (err) {                                                 
                console.error(err);                                    
            }                                                          
           console.log('.eleventyignore has been Deleted');                           
        }); 
    } catch (error) {
        console.log('eleventyignore not exist')
    }

}
catch (e) {
    console.error('There was an error in the build process', JSON.stringify(e, null, 4))
    process.exit(1);
}
finally {
    console.log('Minimal build process for site preview.')
}