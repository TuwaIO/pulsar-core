module.exports = {
  branches: [
    { name: 'dev/**', prerelease: 'alpha' },
    { name: 'fix/**', prerelease: 'alpha' },
    { name: 'feat/**', prerelease: 'alpha' },
  ],

  tagFormat: 'v${version}-alpha-skip',

  plugins: ['@semantic-release/commit-analyzer', 'semantic-release-pnpm'],
};
