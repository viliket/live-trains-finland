import path from 'path';

import type { NextConfig } from 'next';
import { InjectManifest } from 'workbox-webpack-plugin';

const nextConfig: NextConfig = {
  output: 'export',
  staticPageGenerationTimeout: 60 * 5,
  webpack(config, context) {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new InjectManifest({
          swSrc: path.join(__dirname, 'src/service-worker.ts'),
          swDest: path.join(__dirname, 'public/service-worker.js'),
          additionalManifestEntries: [
            {
              url: '/index.html',
              revision: context.buildId,
            },
            {
              url: '/[station].html',
              revision: context.buildId,
            },
            {
              url: '/train/[...train].html',
              revision: context.buildId,
            },
          ],
          // Similar config as in
          // https://github.com/shadowwalker/next-pwa/blob/master/index.js
          exclude: [
            ({ asset }) =>
              asset.name.startsWith('server/') ||
              asset.name.match(
                /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
              ),
          ],
          modifyURLPrefix: {
            '/_next/../public/': '/',
          },
          dontCacheBustURLsMatching: /^\/_next\/\/?static\/.*/i,
          manifestTransforms: [
            async (manifestEntries) => {
              const manifest = manifestEntries.map((m) => {
                m.url = m.url.replace(
                  '/_next//static/image',
                  '/_next/static/image'
                );
                m.url = m.url.replace(
                  '/_next//static/media',
                  '/_next/static/media'
                );
                m.url = m.url.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
                return m;
              });
              return { manifest, warnings: [] };
            },
          ],
        })
      );
    }
    // From: https://react-svgr.com/docs/next/
    // and https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js#L389

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            /** @type {import('@svgr/core').Config} */
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
        ],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
