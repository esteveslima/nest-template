module.exports = {
  '**.{js,ts}': [
    'npx eslint --fix',
    'npx prettier --check src',
    'npm run test -- --findRelatedTests --bail',
  ],
  '**.ts': [() => 'npx tsc --noEmit'],
};
