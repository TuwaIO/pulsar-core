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
        verifyConditionsCmd: `
          echo "--- Verifying NPM authentication ---" &&
          echo "NPM registry:" &&
          npm config get registry &&
          echo "NPM user:" &&
          npm whoami
        `,
        prepareCmd: `pnpm -r exec pnpm dlx json -I -f package.json -e "this.version = '\${nextRelease.version}'"`,
        publishCmd: 'pnpm publish --filter "@tuwaio/*" --no-git-checks --tag alpha --access public',
      },
    ],
    '@semantic-release/github',
  ],
};