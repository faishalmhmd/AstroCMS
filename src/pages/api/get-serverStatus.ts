import type { APIRoute } from 'astro';
import { getDb } from '../../lib/mongodb';
import type { MongoServerStatus } from '@/interface/'; // interface yang kita bikin tadi

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();

    // Ambil serverStatus langsung dari MongoDB
    const serverStatus = (await db.command({
      serverStatus: 1,
    })) as MongoServerStatus;

    // Ambil field penting saja biar respons lebih ringkas
    const responseData = {
      success: true,
      server: {
        host: serverStatus.host,
        version: serverStatus.version,
        process: serverStatus.process,
        pid: serverStatus.pid,
        uptime: serverStatus.uptime,
      },
      connections: serverStatus.connections,
      memory: serverStatus.mem,
      opcounters: serverStatus.opcounters,
      network: serverStatus.network,
      asserts: serverStatus.asserts,
      wiredTiger: serverStatus.wiredTiger?.cache,
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

    console.error('❌ Error fetching serverStatus:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: message,
        serverStatus: null,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
