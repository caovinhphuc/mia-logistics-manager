#!/usr/bin/env node
// Quick audit script: fetch actual data from backend and report real columns
// Usage: node scripts/inspectInboundInternational.cjs [apiBase]

const API_BASE = process.argv[2] || 'http://localhost:5050';

async function main() {
  try {
    const endpoint = `${API_BASE.replace(/\/$/, '')}/api/inboundinternational`;

    // Use global fetch if available (Node 18+), fallback to node-fetch
    let doFetch = global.fetch;
    if (typeof doFetch !== 'function') {
      doFetch = (await import('node-fetch')).default;
    }

    const res = await doFetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.error(`HTTP ${res.status} when calling ${endpoint}`);
      process.exit(1);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('API did not return an array');
      process.exit(1);
    }

    // Union of keys across all rows
    const allKeys = new Set();
    const nullishCounts = {};

    for (const row of data) {
      const keys = Object.keys(row || {});
      for (const k of keys) {
        allKeys.add(k);
        const v = row[k];
        if (v === null || v === undefined || v === '') {
          nullishCounts[k] = (nullishCounts[k] || 0) + 1;
        }
      }
    }

    const keysSorted = Array.from(allKeys).sort();
    console.log('=== Inbound International Columns (actual) ===');
    console.log(`Records: ${data.length}`);
    console.log(`Total distinct columns: ${keysSorted.length}`);
    console.log('Columns:');
    for (const k of keysSorted) {
      const emptyCount = nullishCounts[k] || 0;
      const emptyPct = data.length
        ? ((emptyCount / data.length) * 100).toFixed(1)
        : '0.0';
      console.log(
        `- ${k} (empty: ${emptyCount}/${data.length} ~ ${emptyPct}%)`
      );
    }

    // Show a sample row for visual verification
    if (data.length > 0) {
      console.log('\nSample row (first):');
      console.log(JSON.stringify(data[0], null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
