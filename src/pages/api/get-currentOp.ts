import type { APIRoute } from 'astro';
import { getAdminDb } from '../../lib/mongodb';
import type { CurrentOpItem } from '@/interface';

export const GET: APIRoute = async () => {
  try {
    const db = await getAdminDb();

    const raw = (await db.command({ currentOp: 1 })) as any;
    const inprog: any[] = Array.isArray(raw?.inprog) ? raw.inprog : [];

    const operations: CurrentOpItem[] = inprog.map((op) => ({
      opid: op.opid ?? `${op.secs_running ?? 0}-${op.client ?? 'unknown'}`,
      ns: op.ns ?? '-',
      desc: op.desc ?? op.op ?? '-',
      client: op.client ?? '-',
      appName: op.appName ?? '-',
      active: Boolean(op.active),
      waitingForLock: Boolean(op.waitingForLock),
      secs_running: typeof op.secs_running === 'number' ? op.secs_running : 0,
      microsecs_running:
        typeof op.microsecs_running === 'number' ? op.microsecs_running : 0,
      command: op.command ?? {},
      planSummary: op.planSummary ?? '-',
      locks: op.locks ?? {},
      type: op.type ?? '-',
    }));

    return new Response(
      JSON.stringify({ success: true, count: operations.length, operations }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;

    console.error('❌ Error fetching currentOp:', error);
    return new Response(
      JSON.stringify({ success: false, error: message, operations: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
