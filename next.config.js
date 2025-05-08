/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['trytako.com', 'tako-static-assets-production.s3.amazonaws.com'],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24, // 24 hours
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; font-src 'self' https://tako-static-assets-production.s3.amazonaws.com; script-src 'none'; sandbox;",
    },
    experimental: {
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
