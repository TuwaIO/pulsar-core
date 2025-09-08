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
          pnpm -r exec pnpm dlx json -I -f package.json -e "this.version = \`\${nextRelease.version}.\$(git rev-parse --short HEAD)\`"
        `,
        publishCmd: 'pnpm publish --filter "@tuwaio/*" --no-git-checks --tag alpha --access public',
        successCmd: `
          VERSION=$(pnpm -r exec node -p "require('./package.json').version" | head -n 1)
          echo "Creating Git tag and GitHub release for v\${VERSION}"
          git tag "v\${VERSION}"
          git push --tags origin
          gh release create "v\${VERSION}" --generate-notes --prerelease -t "v\${VERSION}"
        `,
      },
    ],
  ],
};