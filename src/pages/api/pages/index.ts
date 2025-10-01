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


export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const updateData = await request.json();

    const db = await getDb();
    const collection = db.collection('cms');

    const result = await collection.updateOne(
      { projectId: id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Page not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};