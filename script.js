// ダークモード機能
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// ローカルストレージからダークモード設定を読み込み（デフォルトは有効）
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === null || savedDarkMode === 'true') {
  body.classList.add('dark-mode');
}

// トグルボタンクリック時の処理
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  // ローカルストレージに保存
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
});

// キーボードショートカット：Ctrl + Shift + D でダークモード切り替え
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    darkModeToggle.click();
  }
});

// ========== 波紋エフェクト ==========
const links = document.querySelectorAll('li a');
links.forEach(link => {
  link.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = link.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    link.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// ========== アクセスカウント ==========
function updateAccessCount() {
  let count = parseInt(localStorage.getItem('accessCount') || 0);
  count++;
  localStorage.setItem('accessCount', count);
  document.getElementById('accessCount').textContent = count;
}

function displayAccessCount() {
  const count = localStorage.getItem('accessCount') || 0;
  document.getElementById('accessCount').textContent = count;
}

// ページ読み込み時にアクセスカウント更新
window.addEventListener('load', () => {
  displayAccessCount();
});

// 初回訪問かつまだ更新されていない場合
if (localStorage.getItem('accessCount') === null) {
  updateAccessCount();
}

// ========== 時間帯別メッセージ ==========
function getTimeBasedMessage() {
  // 日本標準時（JST）で現在時刻を取得
  const jstTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const hour = jstTime.getHours();
  const minutes = jstTime.getMinutes();
  const timeInMinutes = hour * 60 + minutes;
  
  // 各時間帯を分単位で定義
  const morning = 6 * 60; // 6:00
  const afternoon = 11 * 60 + 30; // 11:30
  const evening = 17 * 60; // 17:00
  const night = 22 * 60 + 30; // 22:30
  
  if (timeInMinutes >= morning && timeInMinutes < afternoon) {
    return 'おはようございます！🌅';
  } else if (timeInMinutes >= afternoon && timeInMinutes < evening) {
    return 'こんにちは！☀️';
  } else if (timeInMinutes >= evening && timeInMinutes < night) {
    return 'こんばんは！🌆';
  } else {
    return 'おやすみなさい！🌙';
  }
}

window.addEventListener('load', () => {
  const messageElement = document.getElementById('message');
  messageElement.textContent = getTimeBasedMessage();
});

// ========== SNS共有機能 ==========
const twitterShare = document.getElementById('twitterShare');
const lineShare = document.getElementById('lineShare');
const copyShare = document.getElementById('copyShare');

const pageUrl = window.location.href;
const pageTitle = 'norakun344のプロフィール';

// Twitter共有
twitterShare.addEventListener('click', () => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
});

// LINE共有
lineShare.addEventListener('click', () => {
  const lineUrl = `https://line.me/R/msg/text/${encodeURIComponent(pageTitle + ' ' + pageUrl)}`;
  window.open(lineUrl, '_blank');
});

// リンクコピー
copyShare.addEventListener('click', () => {
  navigator.clipboard.writeText(pageUrl).then(() => {
    showNotification('リンクをコピーしました！');
  }).catch(err => {
    console.error('コピーに失敗:', err);
  });
});

// 通知表示
function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('share-notification');
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 2000);
}
