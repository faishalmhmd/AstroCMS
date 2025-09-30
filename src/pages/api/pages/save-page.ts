import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { _id, title, slug, content } = await request.json();

    if (!title || !slug) {
      return new Response(JSON.stringify({ success: false, error: 'Title and slug are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = await getDb();
    const now = new Date().toISOString();
    const doc = { title, slug, content, updatedAt: now };
    const result = await db.collection('page').insertOne(doc as any);

    return new Response(JSON.stringify({ success: true, _id: result.insertedId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
