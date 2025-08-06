
import { DeliveryRecord } from './storage';

export const generatePDF = async (record: DeliveryRecord): Promise<void> => {
  // Create a new window/tab for the PDF content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Unable to open print window');
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Taj Autogarage - Delivery Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .section {
          margin-bottom: 25px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .section h2 {
          color: #2563eb;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
          margin-top: 0;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          color: #333;
        }
        .value {
          color: #666;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signature-box {
          width: 200px;
          height: 80px;
          border: 1px solid #ddd;
          text-align: center;
          padding: 10px;
        }
        .photo {
          width: 100px;
          height: 100px;
          border: 1px solid #ddd;
          object-fit: cover;
        }
        .documents-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 10px;
        }
        .document-item {
          padding: 8px;
          border: 1px solid #eee;
          border-radius: 4px;
          text-align: center;
          font-size: 12px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .bike-details {
          margin-top: 10px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 4px;
          border-left: 3px solid #2563eb;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>TAJ AUTOGARAGE</h1>
        <p>Bike Delivery Invoice</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Bike Information</h2>
        <div class="row">
          <span class="label">Bike Number:</span>
          <span class="value">${record.bikeNumber}</span>
        </div>
        <div class="row">
          <span class="label">Model:</span>
          <span class="value">${record.bikeModel || 'Not specified'}</span>
        </div>
        <div class="row">
          <span class="label">Chassis Number:</span>
          <span class="value">${record.chassisNumber || 'Not specified'}</span>
        </div>
        <div class="row">
          <span class="label">Registration Date:</span>
          <span class="value">${record.registrationDate || 'Not specified'}</span>
        </div>
        ${record.bikeDetails ? `
        <div class="bike-details">
          <div class="label" style="margin-bottom: 5px;">Bike Details:</div>
          <div class="value">${record.bikeDetails.replace(/\n/g, '<br>')}</div>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <h2>Sale Information</h2>
        <div class="row">
          <span class="label">Sale Date:</span>
          <span class="value">${new Date(record.saleDate).toLocaleDateString()}</span>
        </div>
        <div class="row">
          <span class="label">Sale Amount:</span>
          <span class="value">₹${record.sellAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="label">Days Since Sale:</span>
          <span class="value">${Math.floor((Date.now() - new Date(record.saleDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
        </div>
      </div>

      <div class="section">
        <h2>Buyer Information</h2>
        <div style="display: flex; justify-content: space-between;">
          <div style="flex: 1;">
            <div class="row">
              <span class="label">Name:</span>
              <span class="value">${record.buyerName}</span>
            </div>
            <div class="row">
              <span class="label">Mobile:</span>
              <span class="value">${record.buyerMobile}</span>
            </div>
            <div class="row">
              <span class="label">Address:</span>
              <span class="value">${record.buyerAddress || 'Not provided'}</span>
            </div>
          </div>
          ${record.buyerPhoto ? `<img src="${record.buyerPhoto}" alt="Buyer Photo" class="photo">` : ''}
        </div>
      </div>

      <div class="section">
        <h2>Document Checklist</h2>
        <div class="documents-grid">
          <div class="document-item">
            <strong>Insurance:</strong> ${record.documents.insurance ? '✓ Uploaded' : '✗ Missing'}
          </div>
          <div class="document-item">
            <strong>Form 29/30:</strong> ${record.documents.form29_30 ? '✓ Uploaded' : '✗ Missing'}
          </div>
          <div class="document-item">
            <strong>Aadhar Card:</strong> ${record.documents.aadhar ? '✓ Uploaded' : '✗ Missing'}
          </div>
          <div class="document-item">
            <strong>Buyer Photo:</strong> ${record.documents.bank_passbook ? '✓ Uploaded' : '✗ Missing'}
          </div>
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <p style="margin: 0 0 10px 0;"><strong>Buyer Signature:</strong></p>
          ${record.signature ? `<img src="${record.signature}" alt="Signature" style="max-width: 180px; max-height: 60px;">` : ''}
        </div>
        <div class="signature-box">
          <p style="margin: 0 0 10px 0;"><strong>Authorized Signature:</strong></p>
          <p style="margin-top: 30px;">Taj Autogarage</p>
        </div>
      </div>

      <div class="footer">
        <p>This is a computer-generated document from Taj Autogarage Delivery System</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </div>

      <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Invoice</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  // Auto-focus the print window
  printWindow.focus();
};
