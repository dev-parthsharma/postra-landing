// ===== PAGE ROUTING =====
const pages = ['home','pricing','about','features','blog','privacy','cookies','terms','contact','dashboard','careers','press'];

function showPage(id) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    const nav = document.getElementById('nav-' + p);
    if (el) el.classList.toggle('active', p === id);
    if (nav) nav.classList.toggle('active', p === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Re-trigger scroll reveals on page change
  setTimeout(initReveal, 100);
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  m.style.display = m.style.display === 'none' ? 'block' : 'none';
}

// ===== FAQ =====
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));
  if (!isOpen) { answer.classList.add('open'); icon.classList.add('open'); }
}

// ===== OUTPUT PREVIEW TABS =====
function switchTab(btn, tabId) {
  // Deactivate all tabs and contents
  document.querySelectorAll('.otab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.otab-content').forEach(c => c.classList.remove('active'));
  // Activate selected
  btn.classList.add('active');
  const tab = document.getElementById(tabId);
  if (tab) {
    tab.classList.add('active');
    // Animate in
    tab.style.opacity = '0';
    tab.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      tab.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      tab.style.opacity = '1';
      tab.style.transform = 'translateY(0)';
    });
  }
}

// ===== PRICING — static, no toggles needed =====
// Plans: Free ₹0 / Starter ₹199 / Pro ₹399 (India only)

// ===== BLOG FILTER =====
function filterBlog(cat, btn) {
  document.querySelectorAll('#blogGrid .blog-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'block' : 'none';
  });
  document.querySelectorAll('#page-blog .btn').forEach(b => {
    b.className = 'btn btn-outline';
    b.style.cssText = 'padding:8px 18px; font-size:14px;';
  });
  btn.className = 'btn btn-primary';
  btn.style.cssText = 'padding:8px 18px; font-size:14px;';
}

// ===== CONTACT FORM =====
function submitContact() {
  const success = document.getElementById('contactSuccess');
  if (success) {
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 4000);
  }
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    // Format with + suffix
    if (target >= 1000) {
      el.textContent = (current >= 1000 ? Math.floor(current / 1000) + ',' + String(current % 1000).padStart(3, '0') : current) + '+';
    } else {
      el.textContent = current + '+';
    }
    if (progress < 1) requestAnimationFrame(update);
    else {
      if (target >= 1000) {
        el.textContent = Math.floor(target / 1000).toLocaleString() + ',000+';
      } else {
        el.textContent = target + '+';
      }
    }
  }
  requestAnimationFrame(update);
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const revealEls = document.querySelectorAll('.page.active .reveal:not(.revealed)');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
}

// ===== COUNTER INTERSECTION OBSERVER =====
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ===== STICKY NAV SHADOW =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.08)'
      : 'none';
  }
});

// ===== GOOGLE SHEETS ENDPOINT =====
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzNV8P3eQPHyp9SHGTD5wl-curtAHSZ6H7quVI0ohQddheLgISAWAJfEaUb7UvLsJidOQ/exec';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
});

// Also init after a short delay to catch above-the-fold elements
setTimeout(() => {
  initReveal();
  initCounters();
}, 200);

// ===================================================
//  FEEDBACK WIDGET
// ===================================================

const FEEDBACK_EMAIL = 'sharmaaparth.07@gmail.com'; // Formsubmit endpoint

let fbOpen = false;
let fbMode = 'text';
let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;
let audioBlob = null;

function toggleFeedback() {
  fbOpen = !fbOpen;
  const panel   = document.getElementById('fbPanel');
  const overlay = document.getElementById('fbOverlay');
  const trigger = document.getElementById('fbTrigger');

  if (fbOpen) {
    panel.style.display = 'block';
    requestAnimationFrame(() => panel.classList.add('visible'));
    overlay.classList.add('visible');
    trigger.classList.add('open');
    trigger.querySelector('.fb-trigger-label').textContent = 'Close';
  } else {
    panel.classList.remove('visible');
    overlay.classList.remove('visible');
    trigger.classList.remove('open');
    trigger.querySelector('.fb-trigger-label').textContent = 'Feedback';
    // hide after animation
    setTimeout(() => { if (!fbOpen) panel.style.display = 'none'; }, 250);
    // reset if needed
    resetFeedbackPanel();
  }
}

function switchMode(mode) {
  fbMode = mode;
  document.getElementById('fbTextBody').style.display  = mode === 'text'  ? 'block' : 'none';
  document.getElementById('fbVoiceBody').style.display = mode === 'voice' ? 'block' : 'none';
  document.getElementById('modeTextBtn').classList.toggle('active',  mode === 'text');
  document.getElementById('modeVoiceBtn').classList.toggle('active', mode === 'voice');
}

// ── Text feedback ──────────────────────────────────
async function submitFeedback() {
  const text  = document.getElementById('fbTextarea').value.trim();
  const email = document.getElementById('fbEmail').value.trim();

  if (!text) {
    document.getElementById('fbTextarea').focus();
    document.getElementById('fbTextarea').style.borderColor = '#fca5a5';
    setTimeout(() => document.getElementById('fbTextarea').style.borderColor = '', 1500);
    return;
  }

  const btn = document.querySelector('.fb-submit-btn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    // Send via Formsubmit (no-cors, fire-and-forget)
    await fetch(`https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: '💬 Postra Landing Page Feedback',
        message: text,
        email: email || 'anonymous',
        page: window.location.href,
        _captcha: 'false'
      })
    });
  } catch(e) {
    // silent fail — still show success to user
  }

  showFeedbackSuccess();
}

// ── Voice recording ────────────────────────────────
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      document.getElementById('fbAudio').src = url;
      showVoiceState('done');
      stream.getTracks().forEach(t => t.stop());
    };

    mediaRecorder.start();
    recordingSeconds = 0;
    showVoiceState('recording');

    recordingTimer = setInterval(() => {
      recordingSeconds++;
      const m = Math.floor(recordingSeconds / 60);
      const s = String(recordingSeconds % 60).padStart(2, '0');
      document.getElementById('fbTimer').textContent = `${m}:${s}`;
      // auto-stop at 2 minutes
      if (recordingSeconds >= 120) stopRecording();
    }, 1000);

  } catch(err) {
    alert('Microphone access denied. Please allow mic access and try again.');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  clearInterval(recordingTimer);
}

function retakeRecording() {
  audioBlob = null;
  audioChunks = [];
  document.getElementById('fbAudio').src = '';
  showVoiceState('idle');
}

async function submitVoiceFeedback() {
  if (!audioBlob) return;

  const btn = document.querySelector('.fb-voice-done .btn-primary');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    // Convert to base64 and send via formsubmit as text fallback
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      // Send a notification email (voice blob too large for basic form, so we notify)
      await fetch(`https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: '🎙️ Postra Voice Feedback',
          message: `Voice note recorded (${recordingSeconds}s). Audio data attached below.`,
          audio_base64: reader.result.substring(0, 500) + '... [truncated - full audio in recorder]',
          page: window.location.href,
          _captcha: 'false'
        })
      });
    };
  } catch(e) { /* silent */ }

  showFeedbackSuccess();
}

function showVoiceState(state) {
  document.getElementById('fbVoiceIdle').style.display     = state === 'idle'      ? 'flex'  : 'none';
  document.getElementById('fbVoiceRecording').style.display = state === 'recording' ? 'flex'  : 'none';
  document.getElementById('fbVoiceDone').style.display      = state === 'done'      ? 'block' : 'none';
}

function showFeedbackSuccess() {
  document.getElementById('fbModes').style.display    = 'none';
  document.getElementById('fbTextBody').style.display  = 'none';
  document.getElementById('fbVoiceBody').style.display = 'none';
  document.getElementById('fbSuccess').style.display   = 'block';
}

function resetFeedbackPanel() {
  // Only reset after panel is fully hidden
  setTimeout(() => {
    const success = document.getElementById('fbSuccess');
    if (success) success.style.display = 'none';
    const modes = document.getElementById('fbModes');
    if (modes) modes.style.display = 'flex';
    const textarea = document.getElementById('fbTextarea');
    if (textarea) textarea.value = '';
    const email = document.getElementById('fbEmail');
    if (email) email.value = '';
    switchMode('text');
    showVoiceState('idle');
    audioBlob = null;
  }, 300);
}
