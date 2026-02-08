/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Добавим стандартную опцию для примера
  // Здесь в будущем могут быть другие настройки

 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
