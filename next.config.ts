import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';
import CONFIG from './portfolio.config';

const nextConfig: NextConfig = {
  basePath: CONFIG.base || '',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/overview',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'github.com',
      'githubusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
};

export default withSerwist(nextConfig);
