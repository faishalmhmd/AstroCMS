import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ success: false, error: 'id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = await getDb();
    const page = await db.collection('page').findOne({ _id: new ObjectId(id) });

    if (!page) {
      return new Response(JSON.stringify({ success: false, error: 'Page not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, page }), {
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
