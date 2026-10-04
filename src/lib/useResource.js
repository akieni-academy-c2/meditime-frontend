import { useEffect, useState } from 'react';
import { api } from './api.js';

// One cancellable read per screen; no session or server permissions cached here.
export function useResource(path) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({ path: null, data: null, error: '', loading: true });
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setResult({ path, data: null, error: '', loading: true });
    api(path, { signal: controller.signal }).then(data => {
      if (!controller.signal.aborted) setResult({ path, data, error: '', loading: false });
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ path, data: null, error: error.message, loading: false });
    });
    return () => controller.abort();
  }, [path, revision]);
  return { ...(result.path === path ? result : { data: null, error: '', loading: Boolean(path) }), reload: () => setRevision(value => value + 1) };
}
