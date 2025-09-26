export interface MongoServerStatus {
  host: string;
  version: string;
  process: string;
  pid: number;
  uptime: number;

  connections: {
    current: number;
    available: number;
    totalCreated: number;
  };

  mem?: {
    resident: number;
    virtual: number;
    mapped?: number;
  };

  opcounters: {
    insert: number;
    query: number;
    update: number;
    delete: number;
    getmore: number;
    command: number;
  };

  network: {
    bytesIn: number;
    bytesOut: number;
    numRequests: number;
  };

  asserts: {
    regular: number;
    warning: number;
    msg: number;
    user: number;
    rollovers: number;
  };

  wiredTiger?: {
    cache: {
      'bytes currently in the cache': number;
      'maximum bytes configured': number;
      'tracked dirty bytes in the cache': number;
      'tracked bytes belonging to internal pages in the cache': number;
    };
  };
}

// Normalized currentOp item returned by /api/get-currentOp
export interface CurrentOpItem {
  opid: string;
  ns: string; // namespace db.collection
  desc: string;
  client: string;
  appName: string;
  active: boolean;
  waitingForLock: boolean;
  secs_running: number;
  microsecs_running: number;
  command: Record<string, any>;
  planSummary: string;
  locks: Record<string, any>;
  type: string;
}

// Flattened view returned by /api/get-serverStatus
export interface ServerStatusView {
  success?: boolean;
  server?: {
    host: string;
    version: string;
    process: string;
    pid: number;
    uptime: number;
  };
  connections?: {
    current: number;
    available: number;
    totalCreated: number;
  };
  memory?: {
    resident?: number;
    virtual?: number;
  };
  opcounters?: {
    insert: number;
    query: number;
    update: number;
    delete: number;
    getmore: number;
    command: number;
  };
  network?: {
    bytesIn?: number;
    bytesOut?: number;
    numRequests: number;
    physicalBytesIn?: number;
    physicalBytesOut?: number;
  };
  asserts?: Record<string, number>;
  wiredTiger?: Record<string, any>;
}
