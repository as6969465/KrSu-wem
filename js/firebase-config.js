// Firebase 設定 — 請替換為您實際的 Firebase 專案設定
const firebaseConfig = {
  apiKey: "AIzaSyAIiqAUgMOlsAFj3NBxLkrXP93B2ax17as",
  authDomain: "krsu-wem.firebaseapp.com",
  projectId: "krsu-wem",
  storageBucket: "krsu-wem.firebasestorage.app",
  messagingSenderId: "645806466471",
  appId: "1:645806466471:web:74a69a4572233de778c282"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// 全域 helper：取得當前登入使用者
function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged(user => {
      unsub();
      resolve(user);
    });
  });
}

// 全域 helper：HTML 逸脫（防止 XSS）
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 全域 helper：驗證圖片來源（允許 https:// 或 base64 data:image/）
function safeImgSrc(url) {
  if (!url) return '';
  if (/^data:image\//i.test(url)) return url; // base64，直接使用
  return /^https:\/\//i.test(url) ? escapeHtml(url) : '';
}

// 全域 helper：格式化金額
function formatPrice(n) {
  return 'NT$ ' + Number(n).toLocaleString('zh-TW');
}

// 全域 helper：格式化日期
function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('zh-TW');
}
