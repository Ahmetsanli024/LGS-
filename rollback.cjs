const { execSync } = require('child_process');
try {
  execSync('git checkout -- components/Module*.tsx', { stdio: 'inherit' });
  console.log("Git checkout success");
} catch(e) {
  console.log("No git or error", e);
}
