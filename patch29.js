const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Revert ai to ^3.4.33
pkg.dependencies['ai'] = '^3.4.33';

// Add overrides for the vulnerable sub-dependencies
pkg.overrides = {
  "@ai-sdk/provider-utils": "3.0.98",
  "jsondiffpatch": "0.8.0"
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log("Patched package.json");
