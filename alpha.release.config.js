module.exports = {
  branches: [
    'main',
    { name: 'dev/**', prerelease: 'alpha' },
    { name: 'fix/**', prerelease: 'alpha' },
    { name: 'feat/**', prerelease: 'alpha' },
  ],
  tagFormat: 'v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/exec',
      {
        publishCmd: 'pnpm publish --filter "@tuwaio/*" --no-git-checks --tag alpha',
      },
    ],
    '@semantic-release/github',
  ],
};