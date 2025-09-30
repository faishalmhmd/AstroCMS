import { useState, useEffect } from 'react';
import axios from 'axios';
import { type ResponseReport } from '@/interface';
import type {
  ServerStatusView,
  CurrentOpItem,
  HostInfoView,
  IProject,
} from '@/interface';

interface IPages<T = any> {
  _id: string;
  title?: string;
  slug?: string;
  content?: T;
  root: IRootPages;
  updatedAt?: string;
}

interface IRootPages {
  props: {
    title: string;
  };
}

interface UseGetDataResult {
  stats: ResponseReport | null;
  serverStatus: ServerStatusView | null;
  currentOps: CurrentOpItem[];
  hostInfo: HostInfoView | null;
  pages: IPages[];
  projects: IProject[];
  loading: boolean;
  error: string | null;
  setPages: React.Dispatch<React.SetStateAction<IPages[]>>;
  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
}

export const useGetData = (): UseGetDataResult => {
  const [stats, setStats] = useState<ResponseReport | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatusView | null>(
    null
  );
  const [pages, setPages] = useState<IPages[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [currentOps, setCurrentOps] = useState<CurrentOpItem[]>([]);
  const [hostInfo, setHostInfo] = useState<HostInfoView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          statsRes,
          pagesRes,
          serverStatusRes,
          currentOpRes,
          hostInfoRes,
          projectsRes,
        ] = await Promise.all([
          axios.get('/api/get-stats'),
          axios.get('/api/get-pages'),
          axios.get('/api/get-serverStatus'),
          axios.get('/api/get-currentOp'),
          axios.get('/api/get-hostInfo'),
          axios.get('/api/get-projects'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        } else {
          throw new Error(statsRes.data.error || 'Gagal mengambil statistik');
        }

        if (pagesRes.data.success) {
          setPages(pagesRes.data.pages);
        } else {
          throw new Error(pagesRes.data.error || 'Gagal mengambil halaman');
        }

        if (serverStatusRes.data.success) {
          setServerStatus(serverStatusRes.data);
        } else {
          throw new Error(
            serverStatusRes.data.error || 'Gagal mengambil server status'
          );
        }

        if (currentOpRes.data.success) {
          setCurrentOps(currentOpRes.data.operations as CurrentOpItem[]);
        } else {
          throw new Error(
            currentOpRes.data.error || 'Gagal mengambil current operations'
          );
        }

        if (hostInfoRes.data && hostInfoRes.data.system) {
          setHostInfo(hostInfoRes.data as HostInfoView);
        } else if (hostInfoRes.data.success === false) {
          throw new Error(
            hostInfoRes.data.error || 'Gagal mengambil host info'
          );
        }

        if (projectsRes.data.success) {
          setProjects(projectsRes.data.projects as IProject[]);
        } else if (projectsRes.data.success === false) {
          throw new Error(projectsRes.data.error || 'Gagal mengambil projects');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi error saat fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    stats,
    serverStatus,
    currentOps,
    hostInfo,
    setPages,
    pages,
    projects,
    setProjects,
    loading,
    error,
  };
};
