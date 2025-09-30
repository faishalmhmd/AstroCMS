import type { APIRoute } from 'astro';
import { getDb } from '../../lib/mongodb';

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('project');

    const projects = await collection
      .find({}, { projection: {} })
      .sort({ updatedAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, projects }), {
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
