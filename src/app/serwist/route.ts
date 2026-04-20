import { spawnSync } from 'node:child_process';
import { createSerwistRoute } from '@serwist/turbopack';
import CONFIG from '~/portfolio.config';

const isProduction = process.env.NODE_ENV !== 'production';
const enablePwa = CONFIG.enablePWA && isProduction;

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).stdout?.trim() ?? crypto.randomUUID();

const serwistHandlers = enablePwa
  ? createSerwistRoute({
      additionalPrecacheEntries: [{ url: '/~offline', revision }],
      swSrc: 'app/sw.ts',
      useNativeEsbuild: true,
    })
  : null;

export const GET = serwistHandlers?.GET;
export const dynamic = serwistHandlers?.dynamic ?? 'force-static';
export const dynamicParams = serwistHandlers?.dynamicParams;
export const revalidate = serwistHandlers?.revalidate;
export const generateStaticParams = serwistHandlers?.generateStaticParams;
