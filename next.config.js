/** @type {import('next').NextConfig} */
const nextConfig = {
    // https://utfs.io/f/4ed2c206-a899-4474-8943-16c8cecd7b5a-iko5rr.png
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/f/**',
            },
        ],
    },
    reactStrictMode: false
}

module.exports = nextConfig
