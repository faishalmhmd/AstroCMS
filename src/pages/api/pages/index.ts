import type { APIRoute } from 'astro';
import { getDb } from '@/lib/mongodb';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    const db = await getDb();
    const collection = db.collection('cms');

    let query: any = {};
    if (projectId) {
      query.projectId = projectId;
    }

    const pages = await collection
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, pages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const db = await getDb();
    const collection = db.collection('cms');

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
