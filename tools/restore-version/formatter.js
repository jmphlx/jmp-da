class VersionResult {
  constructor(item) {
    this.url = item.url;
    this.date = item.date;
    this.label = item.label;
    this.path = item.path;
    this.time = item.time;
    this.timestamp = item.timestamp;
  }
}

export function formatDate(timestamp) {
  const rawDate = timestamp ? new Date(timestamp) : new Date();
  const date = rawDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  const time = rawDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return { date, time };
}

export function formatVersions(json) {
  // Sort by timestamp epoch
  json.sort((a, b) => b.timestamp - a.timestamp);

  // Make human readable entries
  const ungrouped = json.map((entry) => {
    const { date, time } = formatDate(entry.timestamp);
    return {
      date,
      time,
      ...entry,
      isVersion: !!entry.url,
    };
  });

  // Group everything by date
  return ungrouped.reduce((acc, entry) => {
    // Elevate versions to the top
    if (entry.isVersion) {
      acc.push(new VersionResult(entry));
    }
    return acc;
  }, []);
}
