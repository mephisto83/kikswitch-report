var fs = require('fs');
console.log('asdf');

let file_contents = fs.readFileSync('./index.html', 'utf8')


let notsame = false;
let oldone = '';
do {
    oldone = file_contents;
    file_contents = file_contents.replace(`="/`, '="./');
    notsame = file_contents !== oldone;
}
while (notsame);

fs.writeFileSync('./index.html', file_contents, 'utf8')