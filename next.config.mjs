/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // ⚠️ Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
      },
      eslint: {
        // ⚠️ Dangerously allow production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
      swcMinify: true,
};

export default nextConfig;
