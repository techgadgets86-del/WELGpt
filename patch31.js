const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

pkg.overrides = {
  "@ai-sdk/provider-utils": "4.0.50",
  "jsondiffpatch": "0.7.6"
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
