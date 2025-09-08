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
        prepareCmd: `
          echo "Final version will be: \${nextRelease.version}.\$(git rev-parse --short HEAD)"
          pnpm -r exec pnpm dlx json -I -f package.json -e "this.version = '\${nextRelease.version}.\$(git rev-parse --short HEAD)'"
        `,
        publishCmd: 'pnpm publish --filter "@tuwaio/*" --no-git-checks --tag alpha --access public',
        successCmd: `
          FINAL_VERSION="\${nextRelease.version}.\$(git rev-parse --short HEAD)"
          echo "Creating Git tag and GitHub release for v$FINAL_VERSION"
          git tag "v$FINAL_VERSION"
          git push origin "refs/tags/v$FINAL_VERSION"
          gh release create "v$FINAL_VERSION" --generate-notes --prerelease -t "v$FINAL_VERSION"
        `,
      },
    ],
  ],
};