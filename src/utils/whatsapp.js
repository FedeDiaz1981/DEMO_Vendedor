export function buildOrderText(businessName, items, client = '') {
  const lines = [];
  lines.push(`Pedido ${businessName}`);
  lines.push('----------------');
  items.forEach((i, idx) => {
    lines.push(`${idx+1}) ${i.name} - SKU ${i.id}`);
    lines.push(`   Talle: ${i.size} | Color: ${i.color} | Cant: ${i.qty} `);
    lines.push(' ')
  });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  lines.push('----------------');
  // lines.push(`TOTAL: $${total}`);
  if (client) lines.push(`Cliente: ${client}`);
  return lines.join('\n');
}

export function buildWhatsAppUrl(phone, text) {
  const encoded = encodeURIComponent(text);
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

  // Mobile → abre app/web según corresponda
  // Desktop → WhatsApp Web
  if (isMobile) {
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  } else {
    return `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  }
}


//| $${i.price} c/u | Subtotal: $${i.price * i.qty}