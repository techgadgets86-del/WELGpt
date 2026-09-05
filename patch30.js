const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Revert ai to ^3.4.33
pkg.dependencies['ai'] = '^3.4.33';

// Override the vulnerable provider-utils to v4.0.50 (a stable 4.x version)
// And jsondiffpatch to 0.8.0
pkg.overrides = {
  "@ai-sdk/provider-utils": "4.0.50",
  "jsondiffpatch": "0.8.0"
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log("Patched package.json with working overrides");
