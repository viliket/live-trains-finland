import type { Config as SvgrConfig } from '@svgr/core';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  staticPageGenerationTimeout: 60 * 5,
  // Workaround for Turbopack + MUI Pages Router hydration mismatch.
  // See https://github.com/vercel/next.js/issues/82607 and
  // https://github.com/mui/material-ui/issues/46181#issuecomment-2894160823
  transpilePackages: ['@mui/material-nextjs', '@mui/lab'],
  experimental: {
    optimizePackageImports: ['mdi-material-ui'],
  },
  turbopack: {
    rules: {
      '*.svg': [
        {
          condition: { query: '?url' },
          type: 'asset',
        },
        {
          condition: { not: { query: '?url' } },
          as: '*.js',
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                prettier: false,
                svgo: false,
                titleProp: true,
                ref: true,
              } satisfies SvgrConfig,
            },
          ],
        },
      ],
    },
  },
};

export default nextConfig;
