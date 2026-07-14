const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;

function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged(user => { unsub(); resolve(user); });
  });
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeImgSrc(url) {
  if (!url) return '';
  if (/^data:image\//i.test(url)) return url;
  return /^https:\/\//i.test(url) ? escapeHtml(url) : '';
}

const STORE_NAME_KEY = 'krsu_store_name';
let _storeName = localStorage.getItem(STORE_NAME_KEY) || '';

(function() {
  if (_storeName) {
    document.querySelectorAll('.store-name-el').forEach(el => { el.textContent = _storeName; });
  }
})();

async function applyStoreName(titleSuffix) {
  try {
    const snap = await db.collection('settings').doc('general').get();
    const fetched = (snap.exists && snap.data().storeName) ? snap.data().storeName : '';
    if (fetched !== _storeName) { _storeName = fetched; localStorage.setItem(STORE_NAME_KEY, _storeName); }
  } catch(e) { if (!_storeName) _storeName = ''; }
  document.querySelectorAll('.store-name-el').forEach(el => { el.textContent = _storeName; });
  if (titleSuffix !== undefined) document.title = _storeName + (titleSuffix || '');
}

// Check admin by UID first, then by email (for Google sign-in users)
async function checkAdmin(user) {
  if (!user) return false;
  const uidDoc = await db.collection('admins').doc(user.uid).get();
  if (uidDoc.exists) return true;
  if (!user.email) return false;
  const emailSnap = await db.collection('settings').doc('adminEmails').get();
  if (!emailSnap.exists) return false;
  const emails = (emailSnap.data().emails || []);
  if (!emails.includes(user.email)) return false;
  // Auto-register UID for future fast-path
  db.collection('admins').doc(user.uid).set({
    email: user.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(() => {});
  return true;
}

function formatPrice(n) {
  return 'NT$ ' + Number(n).toLocaleString('zh-TW');
}

function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('zh-TW');
}
