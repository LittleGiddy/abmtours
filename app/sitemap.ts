import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://abmtours.co.tz',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://abmtours.co.tz/safaris',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://abmtours.co.tz/destinations/serengeti',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    // Add more pages here
  ]
}