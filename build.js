var fs = require('fs');


if (fs.existsSync('./public/img/project.json')) {
    let fileContents = fs.readFileSync('./public/img/project.json', 'utf8');
    fs.writeFileSync('./src/project.ts', `export default ${fileContents}`, 'utf8');
}