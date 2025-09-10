// Password Strength Checker
const passwordInput = document.getElementById('password-input');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

function checkStrength(password) {
  let score = 0;
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (length >= 8) score++;
  if (length > 12) score++;
  if (hasLower && hasUpper) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  // Weak: <8 chars or only letters
  if (length < 8 || (/^[A-Za-z]+$/.test(password) && length >= 8)) {
    return { level: 'Weak', color: '#ef4444', width: '33%' };
  }
  // Medium: 8-12 chars, includes numbers or symbols
  if (length >= 8 && length <= 12 && (hasNumber || hasSymbol)) {
    return { level: 'Medium', color: '#f59e42', width: '66%' };
  }
  // Strong: >12 chars, mix of upper/lowercase, numbers, symbols
  if (length > 12 && hasLower && hasUpper && hasNumber && hasSymbol) {
    return { level: 'Strong', color: '#22c55e', width: '100%' };
  }
  // Default fallback
  return { level: 'Medium', color: '#f59e42', width: '66%' };
}

passwordInput.addEventListener('input', function () {
  const val = passwordInput.value;
  if (!val) {
    strengthBar.style.width = '0%';
    strengthText.textContent = '';
    strengthText.style.transform = 'none';
    return;
  }
  const { level, color, width } = checkStrength(val);
  strengthBar.style.width = width;
  strengthBar.style.background = color;
  strengthBar.style.boxShadow = `0 0 12px 0 ${color}55`;
  strengthText.textContent = level;
  strengthText.style.color = color;
  // Animate text pop
  strengthText.style.transform = 'scale(1.15)';
  setTimeout(() => {
    strengthText.style.transform = 'scale(1)';
  }, 180);
  // Shake input if weak
  if (level === 'Weak') {
    passwordInput.classList.add('shake');
    setTimeout(() => passwordInput.classList.remove('shake'), 350);
  }
});

// Password Generator
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const generatedPassword = document.getElementById('generated-password');
const copyBtn = document.getElementById('copy-btn');
const copyMsg = document.getElementById('copy-msg');

lengthInput.addEventListener('input', function () {
  lengthValue.textContent = lengthInput.value;
});

function generatePassword(opts) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const num = '0123456789';
  const sym = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
  let chars = '';
  if (opts.uppercase) chars += upper;
  if (opts.lowercase) chars += lower;
  if (opts.numbers) chars += num;
  if (opts.symbols) chars += sym;
  if (!chars) return '';
  let pwd = '';
  for (let i = 0; i < opts.length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Ensure at least one of each selected type
  let arr = [];
  if (opts.uppercase) arr.push(upper[Math.floor(Math.random() * upper.length)]);
  if (opts.lowercase) arr.push(lower[Math.floor(Math.random() * lower.length)]);
  if (opts.numbers) arr.push(num[Math.floor(Math.random() * num.length)]);
  if (opts.symbols) arr.push(sym[Math.floor(Math.random() * sym.length)]);
  // Replace first N chars to guarantee inclusion
  pwd = arr.join('') + pwd.slice(arr.length);
  return pwd;
}

document.getElementById('generator-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const opts = {
    length: parseInt(lengthInput.value, 10),
    uppercase: uppercase.checked,
    lowercase: lowercase.checked,
    numbers: numbers.checked,
    symbols: symbols.checked
  };
  const pwd = generatePassword(opts);
  generatedPassword.value = pwd;
  generatedPassword.style.transform = 'scale(1.12)';
  generatedPassword.style.boxShadow = '0 0 0 3px #60a5fa55';
  setTimeout(() => {
    generatedPassword.style.transform = 'scale(1)';
    generatedPassword.style.boxShadow = '';
  }, 220);
  copyMsg.textContent = '';
  copyMsg.classList.remove('visible');
});

copyBtn.addEventListener('click', function () {
  if (!generatedPassword.value) return;
  generatedPassword.select();
  generatedPassword.setSelectionRange(0, 999);
  document.execCommand('copy');
  copyMsg.textContent = 'Copied!';
  copyMsg.classList.add('visible');
  copyBtn.style.transform = 'scale(1.15) rotate(-6deg)';
  setTimeout(() => {
    copyBtn.style.transform = 'scale(1) rotate(0)';
    copyMsg.classList.remove('visible');
  }, 1200);
});

// Accessibility: allow pressing Enter on copy button
copyBtn.addEventListener('keyup', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    copyBtn.click();
  }
});

// Add shake animation for weak password
const style = document.createElement('style');
style.innerHTML = `
.shake {
  animation: shakeAnim 0.35s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shakeAnim {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-8px); }
  40%, 60% { transform: translateX(8px); }
}
`;
document.head.appendChild(style);
