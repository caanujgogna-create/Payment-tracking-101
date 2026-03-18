export const CATEGORIES = ['Food','Shopping','Travel','Entertainment','Bills','Health','Transfer','Other'];
export const UPI_APPS   = ['GPay','PhonePe','Paytm','BHIM','Amazon Pay','WhatsApp Pay'];
export const BANKS      = ['HDFC','SBI','ICICI','Axis','Kotak','IDFC','Yes Bank','PNB','BOB'];
export const CAT_COLORS = { Food:'#f97316',Shopping:'#a855f7',Travel:'#3b82f6',Entertainment:'#ec4899',Bills:'#ef4444',Health:'#10b981',Transfer:'#6366f1',Other:'#94a3b8' };
export const CAT_ICONS  = { Food:'🍜',Shopping:'🛍️',Travel:'🚗',Entertainment:'🎬',Bills:'🧾',Health:'💊',Transfer:'💸',Other:'📌' };
export const COLORS = { bg:'#0a0e1a',surface:'#111827',border:'#1e2d45',border2:'#0d1626',text:'#e2e8f0',text2:'#94a3b8',text3:'#64748b',text4:'#475569',blue:'#3b82f6',red:'#f87171',green:'#34d399' };
export const fmtCur  = (n) => '₹' + (n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
export const fmtDate = (s) => new Date(s).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
export const today   = () => new Date().toISOString().split('T')[0];
export const uid     = () => Date.now().toString() + Math.random().toString(36).slice(2);
export const SAMPLE_SMS = [
  "Your a/c XXXX1234 debited Rs.499.00 on 17-Mar-26 for UPI/GPay/food@okaxis. Avl Bal: Rs.12,450.00",
  "Rs.1,200 credited to a/c XXXX5678 via NEFT from RAJESH KUMAR on 17-Mar-26. Ref: HDFCN1234567",
  "Debit of Rs.3,499.00 from HDFC a/c XXXX5678 on 17/03/2026 for UPI txn to Flipkart@ybl",
  "Your SBI a/c XXXX9012 is debited Rs.800.00 for ELECTRICITY BILL on 16-Mar-26. Avl Bal: Rs.5,600",
  "INR 250.00 debited from a/c XX3456 on 15-Mar-26 UPI/paytm.movies@paytm Info: Movie Booking",
];
export function parseSMS(text) {
  const debitMatch  = text.match(/(?:debited?|Debit of|INR)\s*Rs?\.?\s*([\d,]+(?:\.\d{2})?)/i);
  const creditMatch = text.match(/(?:credited?)\s*(?:to[^R]*)?Rs?\.?\s*([\d,]+(?:\.\d{2})?)/i);
  const amount = debitMatch ? parseFloat(debitMatch[1].replace(/,/g,'')) : creditMatch ? parseFloat(creditMatch[1].replace(/,/g,'')) : null;
  if (!amount) return null;
  const type = creditMatch ? 'credit' : 'debit';
  const upiMatch = text.match(/UPI\/([\w@.]+)/i);
  const neftMatch = text.match(/NEFT/i);
  const source = upiMatch ? 'UPI' : neftMatch ? 'NEFT' : text.toLowerCase().includes('imps') ? 'IMPS' : 'Bank';
  let description = '';
  if (upiMatch) description = upiMatch[1];
  else { const m = text.match(/for (.+?)(?:\.|$)/i); if(m) description = m[1].trim(); }
  const balMatch = text.match(/Avl Bal:\s*Rs?\.?([\d,]+(?:\.\d{2})?)/i);
  const balance = balMatch ? parseFloat(balMatch[1].replace(/,/g,'')) : null;
  return { id:uid(), amount, type, source, description:description||'Transaction', balance, category:'Other', date:today() };
}
