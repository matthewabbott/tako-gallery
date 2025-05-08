/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['trytako.com'],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24, // 24 hours
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    experimental: {
        serverActions: true,
        optimizeCss: true,
        optimizePackageImports: ['lucide-react'],
    },
    // Enable response compression
    compress: true,
    // Increase static generation concurrency
    staticPageGenerationTimeout: 120,
    // Optimize output
    swcMinify: true,
    // Reduce bundle size
    productionBrowserSourceMaps: false,
}

module.exports = nextConfig
