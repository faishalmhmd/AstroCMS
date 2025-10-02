import type { APIRoute } from 'astro';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const data = await request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Page ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const db = await getDb();
    const collection = db.collection('cms');

    // Update the page
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Page not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Page ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const db = await getDb();
    const collection = db.collection('cms');

    // Delete the page
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Page not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
