const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

pkg.dependencies['ai'] = '^3.4.33';
pkg.overrides = {
  "jsondiffpatch": "0.7.6"
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
