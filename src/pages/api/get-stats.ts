import type { APIRoute } from 'astro';
import { getDb } from '../../lib/mongodb';

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('cms');

    // Get basic collection stats
    const stats = await db.command({ collStats: 'cms' });

    // Get document count
    const totalPages = await collection.countDocuments();

    // Get pages created in different time periods
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Count pages by time periods
    const [pagesToday, pagesThisWeek, pagesThisMonth, pagesThisYear] =
      await Promise.all([
        collection.countDocuments({
          createdAt: { $gte: todayStart },
        }),
        collection.countDocuments({
          createdAt: { $gte: weekStart },
        }),
        collection.countDocuments({
          createdAt: { $gte: monthStart },
        }),
        collection.countDocuments({
          createdAt: { $gte: yearStart },
        }),
      ]);

    // Get pages with and without titles
    const pagesWithTitles = await collection.countDocuments({
      $or: [
        { 'root.props.title': { $exists: true, $ne: '' } },
        { title: { $exists: true, $ne: '' } },
      ],
    });
    const pagesWithoutTitles = totalPages - pagesWithTitles;

    // Get pages with slugs
    const pagesWithSlugs = await collection.countDocuments({
      slug: { $exists: true, $ne: '' },
    });

    // Get recent activity (last 5 pages)
    const recentPages = await collection
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        _id: 1,
        title: 1,
        slug: 1,
        'root.props.title': 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .toArray();

    // Storage statistics
    const storageStats = {
      size: stats.size || 0, // Collection size in bytes
      storageSize: stats.storageSize || 0, // Storage size in bytes
      avgObjSize: stats.avgObjSize || 0, // Average object size
      indexSize: stats.totalIndexSize || 0, // Total index size
      dataSize: stats.size || 0, // Data size
    };

    // Growth statistics (pages created per month for the last 6 months)
    const growthStats = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await collection.countDocuments({
        createdAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      });

      growthStats.push({
        month: monthStart.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        count,
      });
    }

    // Content analysis
    const contentStats = await collection
      .aggregate([
        {
          $project: {
            contentLength: { $size: { $ifNull: ['$content', []] } },
            hasContent: { $gt: [{ $size: { $ifNull: ['$content', []] } }, 0] },
          },
        },
        {
          $group: {
            _id: null,
            avgContentLength: { $avg: '$contentLength' },
            pagesWithContent: { $sum: { $cond: ['$hasContent', 1, 0] } },
            totalPages: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const contentAnalysis = contentStats[0] || {
      avgContentLength: 0,
      pagesWithContent: 0,
      totalPages: 0,
    };

    const responseData = {
      success: true,
      stats: {
        // Overview
        overview: {
          totalPages,
          pagesWithTitles,
          pagesWithoutTitles,
          pagesWithSlugs,
          pagesWithContent: contentAnalysis.pagesWithContent,
          averageContentLength: Math.round(
            contentAnalysis.avgContentLength || 0
          ),
        },

        // Time-based statistics
        timeStats: {
          today: pagesToday,
          thisWeek: pagesThisWeek,
          thisMonth: pagesThisMonth,
          thisYear: pagesThisYear,
        },

        // Storage statistics (in human-readable format)
        storage: {
          totalSize: formatBytes(storageStats.size),
          storageSize: formatBytes(storageStats.storageSize),
          indexSize: formatBytes(storageStats.indexSize),
          avgPageSize: formatBytes(storageStats.avgObjSize),
          raw: storageStats, // Raw bytes for charts/calculations
        },

        // Growth over time
        growth: growthStats,

        // Recent activity
        recentActivity: recentPages.map((page) => ({
          id: page._id,
          title: page.root?.props?.title || page.title || 'Untitled',
          slug: page.slug || null,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
          isNew: page.createdAt && page.createdAt > weekStart,
        })),
      },
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    console.error('❌ Error fetching CMS stats:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
        stats: null,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Helper function to format bytes to human-readable format
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
