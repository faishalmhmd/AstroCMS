import { useState, useEffect } from 'react';
import axios from 'axios';
import { type ResponseReport } from '@/interface';
import type { ServerStatusView } from '@/interface';

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
  pages: IPages[];
  loading: boolean;
  error: string | null;
  setPages: React.Dispatch<React.SetStateAction<IPages[]>>;
}

export const useGetData = (): UseGetDataResult => {
  const [stats, setStats] = useState<ResponseReport | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatusView | null>(
    null
  );
  const [pages, setPages] = useState<IPages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsRes, pagesRes, serverStatusRes] = await Promise.all([
          axios.get('/api/get-stats'),
          axios.get('/api/get-pages'),
          axios.get('/api/get-serverStatus'),
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
      } catch (err: any) {
        setError(err.message || 'Terjadi error saat fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, serverStatus, setPages, pages, loading, error };
};
