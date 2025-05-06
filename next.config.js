/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['trytako.com'],
    },
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig