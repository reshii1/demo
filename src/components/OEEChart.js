import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function OEEChart({ range }) {
  const [dataset, setDataset] = useState(null);

  useEffect(() => {
    fetch('/api/oee')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        // Group entries by yyyy-mm-dd
        const grouped = {};

        json.forEach(d => {
          const dateKey = new Date(d.date).toISOString().split('T')[0]; // e.g., "2025-07-21"
          const oee = Number(d.oee);

          if (!grouped[dateKey]) {
            grouped[dateKey] = [oee];
          } else {
            grouped[dateKey].push(oee);
          }
        });

        // Convert to averaged dataset
        const averagedPts = Object.entries(grouped).map(([dateStr, values]) => {
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          return {
            x: new Date(dateStr).getTime(),
            y: avg,
          };
        });

        // Sort by date
        averagedPts.sort((a, b) => a.x - b.x);
        setDataset(averagedPts);
      })
      .catch(err => {
        console.error('Failed to load OEE data', err);
        setDataset([]); // avoid infinite loading
      });
  }, []);

  if (dataset === null) return <div>Loading chart…</div>;
  if (dataset.length === 0) return <div>No data to display</div>;

  // Apply date range filtering based on `range` prop
  let filteredDataset = dataset;
  if (range) {
    const latestDate = dataset[dataset.length - 1].x;
    let rangeStart;

    switch (range) {
      case '1w':
        rangeStart = latestDate - 7 * 24 * 60 * 60 * 1000;
        break;
      case '1m':
        rangeStart = latestDate - 30 * 24 * 60 * 60 * 1000;
        break;
      case '3m':
        rangeStart = latestDate - 90 * 24 * 60 * 60 * 1000;
        break;
      case '1y':
        rangeStart = latestDate - 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        rangeStart = null;
    }

    if (rangeStart) {
      filteredDataset = dataset.filter(d => d.x >= rangeStart);
    }
  }

  return (
    <LineChart
      width={680}
      height={250}
      dataset={filteredDataset}
      series={[{ dataKey: 'y', label: 'Shift OEE' }]}
      xAxis={[{ dataKey: 'x', scaleType: 'time' }]}
      yAxis={[{ position: 'left', label: 'OEE (%)' }]}
    />
  );
}
