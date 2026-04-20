import type { NextConfig } from "next";
import withPWAInit from '@ducanh2912/next-pwa';
import CONFIG from './portfolio.config';

const withPWA = withPWAInit({
  dest: 'public',
  disable: !CONFIG.enablePWA,
  register: true,
  reloadOnOnline: true,
  workboxOptions: {
    // mirrors your `navigateFallback: undefined`
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  basePath: CONFIG.base || '',
};

export default withPWA(nextConfig);
