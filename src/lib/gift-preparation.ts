/** Share texture preparation only; each click still owns its animation instance. */
export function createGiftPreparation() {
  const jobs = new Map<string, Promise<void>>();
  return (key: string, prepare: () => Promise<unknown>) => {
    const existing = jobs.get(key);
    if (existing) return existing;
    const job = prepare().then(() => {});
    jobs.set(key, job);
    job.catch(() => { if (jobs.get(key) === job) jobs.delete(key); });
    return job;
  };
}