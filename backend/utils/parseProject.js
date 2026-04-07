const parseProjectStructure = (files) => {
  if (!files || !Array.isArray(files)) {
    return "No files found.";
  }

  const ignoreList = [
    'node_modules', 
    '.git', 
    'dist', 
    'build', 
    '.next', 
    'bun.lockb', 
    'package-lock.json'
  ];

  const visiblePaths = files
    .map((file) => file.originalname || "")
    .filter((fileName) => {
      if (!fileName) {
        return false;
      }

      return !ignoreList.some((ignore) => fileName.includes(ignore));
    })
    .sort((a, b) => a.localeCompare(b));

  if (visiblePaths.length === 0) {
    return "No useful files found.";
  }

  return [...new Set(visiblePaths)].join("\n");
};

module.exports = { parseProjectStructure };
