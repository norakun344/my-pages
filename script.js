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

// ページ読み込み時にアクセスカウント更新
window.addEventListener('load', () => {
  updateAccessCount();
});

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

// ========== プロフィール画像のマウストラッキング3D効果 ==========
const profileImage = document.querySelector('.profile-image');
let isMouseOverImage = false;

// プロフィール画像上にマウスが入った時
profileImage.addEventListener('mouseenter', () => {
  isMouseOverImage = true;
});

// プロフィール画像からマウスが出た時
profileImage.addEventListener('mouseleave', () => {
  isMouseOverImage = false;
  profileImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
});

// マウスムーブ時（画像上でだけ動く）
document.addEventListener('mousemove', (e) => {
  if (!isMouseOverImage) return;
  
  const rect = profileImage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const mouseX = e.clientX - centerX;
  const mouseY = e.clientY - centerY;
  
  // マウスの角度を計算（-15度から15度の範囲）
  const rotateY = (mouseX / rect.width) * 30;
  const rotateX = -(mouseY / rect.height) * 30;
  
  profileImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
});
