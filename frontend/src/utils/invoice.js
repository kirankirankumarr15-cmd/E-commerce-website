import { formatPrice } from './helpers';

export const downloadInvoice = (invoice) => {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Invoice ${invoice.invoiceNumber}</title>
<style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#111}
  .header{display:flex;justify-content:space-between;border-bottom:2px solid #4f46e5;padding-bottom:20px;margin-bottom:30px}
  .brand{font-size:24px;font-weight:bold;color:#4f46e5}
  .tagline{color:#666;font-size:12px}
  table{width:100%;border-collapse:collapse;margin:20px 0}
  th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}
  th{background:#f8fafc}
  .totals{margin-top:20px;text-align:right}
  .total-row{font-size:18px;font-weight:bold;color:#4f46e5}
  .footer{margin-top:40px;text-align:center;color:#666;font-size:12px}
</style></head><body>
  <div class="header">
    <div><div class="brand">${invoice.company.name}</div><div class="tagline">${invoice.company.tagline}</div></div>
    <div style="text-align:right">
      <div><strong>Invoice:</strong> ${invoice.invoiceNumber}</div>
      <div><strong>Order:</strong> ${invoice.orderNumber}</div>
      <div><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString('en-IN')}</div>
    </div>
  </div>
  <div><strong>Bill To:</strong><br>${invoice.customer.name}<br>${invoice.customer.email}<br>${invoice.customer.phone}<br>${invoice.customer.address}</div>
  <table><thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
  ${invoice.items.map((i) => `<tr><td>${i.name}</td><td>${i.sku || '-'}</td><td>${i.quantity}</td><td>${formatPrice(i.price)}</td><td>${formatPrice(i.total)}</td></tr>`).join('')}
  </tbody></table>
  <div class="totals">
    <div>Subtotal: ${formatPrice(invoice.pricing.subtotal)}</div>
    ${invoice.pricing.discount ? `<div>Discount${invoice.pricing.couponCode ? ` (${invoice.pricing.couponCode})` : ''}: -${formatPrice(invoice.pricing.discount)}</div>` : ''}
    <div>Tax (GST): ${formatPrice(invoice.pricing.tax)}</div>
    <div>Delivery (${invoice.pricing.deliveryOption}): ${invoice.pricing.delivery === 0 ? 'Free' : formatPrice(invoice.pricing.delivery)}</div>
    <div class="total-row">Total: ${formatPrice(invoice.pricing.total)}</div>
  </div>
  <div style="margin-top:30px;padding:15px;background:#f8fafc;border-radius:8px">
    <strong>Payment:</strong> ${invoice.payment.method?.toUpperCase()} | Status: ${invoice.payment.status} | Ref: ${invoice.payment.reference || 'N/A'}
  </div>
  <div class="footer">${invoice.company.name} | ${invoice.company.email} | ${invoice.company.phone}</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoice.invoiceNumber}.html`;
  a.click();
  URL.revokeObjectURL(url);
};
