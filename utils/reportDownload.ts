// https://kompas365-my.sharepoint.com/:x:/g/personal/frans_suryapradipta_kompas_com/EVDYFbnbp75ApWo6YzvJTpgB6CFYKu_9oZSfGecuB4_fwQ?e=xZ09Yd
/**
 * Downloads an array of objects as a CSV file.
 * @param reports - The array of report objects to export.
 * @param filename - The CSV filename (default: "reports.csv").
 */
export function downloadReportsAsCSV(
  reports: GetReport[],
  filename = `reports-${new Date().getTime()}.csv`
): void {
  if (!reports.length) {
    alert('No reports selected!')
    return
  }

  // Define the order of columns to export
  const headers = [
    'formID',
    'masterUserID',
    'batch',
    'departureDate',
    'loadAmount',
    'documents',
    'driverName',
    'vehicleNo',
    'place',
    'description',
    'createdDate',
    'createdBy',
    'deletedBy',
    'deletedDate',
    'modifiedBy',
    'modifiedDate',
  ]

  // Convert each report to a CSV row
  const csvRows = reports.map((report) => {
    return headers.map((key) => {
      const value = (report as unknown as Record<string, unknown>)[key]

      if (key === 'documents' && Array.isArray(value)) {
        // join all links by semicolon
        return JSON.stringify(value.map((d) => d.link).join('; '))
      }

      return JSON.stringify(value ?? '')
    }).join(',')
  })

  // Combine header + data
  const csvContent = [headers.join(','), ...csvRows].join('\n')

  // Create downloadable file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
