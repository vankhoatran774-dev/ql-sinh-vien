export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>): void {
  if (typeof window === 'undefined') {
    return;
  }

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const csvRows: string[] = [];

  if (headers.length > 0) {
    csvRows.push(headers.join(','));
  }

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      const normalized = value == null ? '' : String(value).replace(/"/g, '""');
      return `"${normalized}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}
