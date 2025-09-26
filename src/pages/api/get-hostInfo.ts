import type { APIRoute } from 'astro';
import { getAdminDb } from '../../lib/mongodb';
import type { HostInfoView } from '@/interface';

export const GET: APIRoute = async () => {
  try {
    const db = await getAdminDb();
    const raw = (await db.command({ hostInfo: 1 })) as any;

    const hostInfo: HostInfoView = {
      success: true,
      system: {
        hostname: raw?.system?.hostname ?? raw?.hostname ?? 'unknown',
        currentTime: raw?.system?.currentTime ?? raw?.system?.currentTimeStr,
        cpuAddrSize: raw?.system?.cpuAddrSize,
        memSizeMB: raw?.system?.memSizeMB ?? (raw?.system?.memSizeMBs ?? undefined),
        numCores: raw?.os?.numCores ?? raw?.system?.numCores,
        cpuArch: raw?.system?.cpuArch ?? raw?.os?.arch,
        numaEnabled: raw?.system?.numaEnabled,
      },
      os: {
        type: raw?.os?.type,
        name: raw?.os?.name,
        version: raw?.os?.version,
        kernelVersion: raw?.os?.kernelVersion,
      },
    };

    return new Response(JSON.stringify(hostInfo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;

    console.error('❌ Error fetching hostInfo:', error);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
