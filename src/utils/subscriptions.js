// Local follow/subscription store, persisted in localStorage.
const KEY = 'yt-clone-subscriptions';
const listeners = new Set();

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((fn) => fn());
};

export const getSubscriptions = () => read();

export const isSubscribed = (channelId) =>
  !!channelId && read().some((c) => c.id === channelId);

export const toggleSubscription = (channel) => {
  if (!channel?.id) return false;
  const items = read();
  const exists = items.some((c) => c.id === channel.id);
  if (exists) {
    write(items.filter((c) => c.id !== channel.id));
    return false;
  }
  write([
    {
      id: channel.id,
      title: channel.title || '',
      thumbnail: channel.thumbnail || '',
      subscribedAt: new Date().toISOString(),
    },
    ...items,
  ]);
  return true;
};

export const onSubscriptionsChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
