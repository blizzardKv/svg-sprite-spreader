const fs = require('fs');

const DEFAULT_SVG_VIEWBOX_LENGTH = 4;
const SVG_SIZES_FALLBACK = ['16', '16'];

const mdHeader = 'Sprite item name | Sizes\n'
  + ' --- | ---\n';

const readFile = (filePath, encoding = 'utf-8') => fs.readFile(filePath, encoding, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const spriteItems = data.split('</symbol>');

  const spriteItemsIds = [];

  spriteItems.forEach((item) => {
    if (item.includes('id="')) {
      const svgName = item.split('id="')[1].split('"')[0].trim();
      const svgViewbox = item.split('viewBox="')[1].split('"')[0].trim().split(' ');
      const svgSizes = svgViewbox && svgViewbox.length === DEFAULT_SVG_VIEWBOX_LENGTH
        ? svgViewbox.slice(-2)
        : SVG_SIZES_FALLBACK;

      if (!svgName) return;

      spriteItemsIds.push({ name: svgName, sizes: svgSizes });
    }
  });

  const outputMdTable = spriteItemsIds.reduce((acc, item) => acc + `${item.name} | ${item.sizes}\n`, mdHeader);

  fs.writeFile('spriteOutput.md', outputMdTable, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});

module.exports = readFile;
