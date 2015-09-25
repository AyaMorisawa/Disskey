import * as shelljs from 'shelljs';
import * as path from 'path';
import * as fs from 'fs';

let packageDir = path.join(path.dirname(fs.realpathSync(__filename)), '../');
shelljs.cd(packageDir);
shelljs.exec(path.join(packageDir, 'node_modules', '.bin', 'electron') + ' .');
