import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: 'id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { title, slug, content } = await request.json();
    const db = await getDb();
    const result = await db.collection('page').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          slug,
          content,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return new Response(JSON.stringify({ success: result.modifiedCount > 0 }), {
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
