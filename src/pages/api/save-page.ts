import type { APIRoute } from 'astro';
import { getDb } from '../../lib/mongodb';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const db = await getDb();
    const collection = db.collection('cms');

    // Add timestamps
    const pageData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(pageData);
    return new Response(
      JSON.stringify({ success: true, id: result.insertedId }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
