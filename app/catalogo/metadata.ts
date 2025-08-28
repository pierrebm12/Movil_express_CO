// Configuración de metadata y viewport para Next.js 13+ (solo Server Component)
// https://nextjs.org/docs/app/api-reference/functions/generate-viewport

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export async function generateMetadata() {
  return {
    metadataBase: new URL('https://movilexpress.com'),
    title: 'Catálogo de productos | MovilExpress',
    description: 'Explora el catálogo completo de productos de MovilExpress. Encuentra celulares, accesorios y más al mejor precio.',
    openGraph: {
      title: 'Catálogo de productos | MovilExpress',
      description: 'Explora el catálogo completo de productos de MovilExpress. Encuentra celulares, accesorios y más al mejor precio.',
      url: 'https://movilexpress.com/catalogo',
      siteName: 'MovilExpress',
      locale: 'es_CO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Catálogo de productos | MovilExpress',
      description: 'Explora el catálogo completo de productos de MovilExpress. Encuentra celulares, accesorios y más al mejor precio.',
    },
  };
}
