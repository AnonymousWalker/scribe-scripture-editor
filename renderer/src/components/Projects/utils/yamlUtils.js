const yaml = window.require('js-yaml');
const fs = window.require('fs');

/**
 * Parses a manifest.yaml file and returns its content as a JS object.
 * @param {string} manifestPath - The full path to the manifest.yaml file
 * @returns {object} Parsed manifest object
 * @throws Error if file does not exist or cannot be parsed
 */
function parseManifestYaml(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error('manifest.yaml not found at: ' + manifestPath);
  }
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  return yaml.load(manifestContent);
}

module.exports = { parseManifestYaml }; 