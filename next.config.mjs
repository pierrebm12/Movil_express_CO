// Excluir rutas dinámicas/admin del export estático
const exportPathMap = async function(defaultPathMap) {
  // Elimina /admin/dashboard y cualquier otra ruta admin
  delete defaultPathMap['/admin/dashboard'];
  delete defaultPathMap['/admin'];
  return defaultPathMap;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  exportPathMap,
}

export default nextConfig
