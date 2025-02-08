import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
    return {
      rules: {
        userAgent: '*',
        allow: [
          '/',              // Homepage
          '/entry',         // Entry form
          '/search',        // Search results
          '/about',         // About page
        ],
        disallow: [
          '/api/*',         // API routes
          '/admin/*',       // Admin pages
          '/dashboard/*'    // User dashboards
        ]
      },
      sitemap: 'https://www.instockmed.com/sitemap.xml',
    }
}