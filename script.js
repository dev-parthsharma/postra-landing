// ===== PAGE ROUTING =====
const pages = ['home','pricing','about','features','blog','privacy','cookies','terms','contact','dashboard', 'careers', 'press'];

function showPage(id) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    const nav = document.getElementById('nav-' + p);
    if (el) el.classList.toggle('active', p === id);
    if (nav) nav.classList.toggle('active', p === id);
  });
  window.scrollTo({top: 0, behavior: 'smooth'});
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

// ===== REGION TOGGLE (Manual - India default) =====
let currentRegion = 'india';
let isYearly = false;

function setRegion(region, el) {
  currentRegion = region;
  document.getElementById('india-pricing').style.display = region === 'india' ? 'block' : 'none';
  document.getElementById('global-pricing').style.display = region === 'global' ? 'block' : 'none';
  document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  updatePrices();
}

function updatePrices() {
  if (currentRegion === 'india') {
    document.getElementById('in-s-price').textContent = isYearly ? '₹1,990' : '₹199';
    document.getElementById('in-s-period').textContent = isYearly ? '/year (Save 2 months)' : '/month';
    document.getElementById('in-p-price').textContent = isYearly ? '₹4,990' : '₹499';
    document.getElementById('in-p-period').textContent = isYearly ? '/year (Save 2 months)' : '/month';
  } else {
    document.getElementById('gl-s-price').textContent = isYearly ? '$90' : '$9';
    document.getElementById('gl-s-period').textContent = isYearly ? '/year (Save 2 months)' : '/month';
    document.getElementById('gl-p-price').textContent = isYearly ? '$190' : '$19';
    document.getElementById('gl-p-period').textContent = isYearly ? '/year (Save 2 months)' : '/month';
  }
}

// ===== BILLING TOGGLE (Monthly / Yearly) =====
function toggleBilling() {
  isYearly = !isYearly;
  const btn = document.getElementById('billingToggle');
  const tMonthly = document.getElementById('t-monthly');
  const tYearly = document.getElementById('t-yearly');
  btn.classList.toggle('yearly', isYearly);
  tMonthly.classList.toggle('active', !isYearly);
  tYearly.classList.toggle('active', isYearly);
  updatePrices();
}

// ===== MODAL =====
function openModal() {
  document.getElementById('earlyAccessModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('earlyAccessModal').style.display = 'none';
  document.body.style.overflow = '';
}
// ===== GOOGLE SHEETS ENDPOINT =====
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyeYQLXgD7-f8D3xhHwEp7_j4Llzf8uML38B6-sm_OYMBctBBmVcvWrLR8PosdmJXL4WA/exec';

async function submitModal() {
  const name = document.getElementById('modal-name').value.trim();
  const ig = document.getElementById('modal-ig').value.trim();
  const niche = document.getElementById('modal-niche').value.trim();
  const errorEl = document.getElementById('modal-error');
  const submitBtn = document.getElementById('modal-submit-btn');

  if (!name || !ig || !niche) {
    errorEl.textContent = 'Please fill in all fields to continue.';
    errorEl.style.display = 'block';
    return;
  }
  errorEl.style.display = 'none';

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  const igClean = ig.replace('@','');
  const timestamp = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});

  try {
    if (SHEETS_URL && SHEETS_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ig: igClean, niche, timestamp, source: 'postra-landing' })
      });
    }
    // Show success regardless (no-cors means we can't read response)
    document.getElementById('modal-ig-confirm').textContent = igClean;
    document.getElementById('modal-form').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
  } catch(err) {
    // Still show success to user — data may have gone through
    document.getElementById('modal-ig-confirm').textContent = igClean;
    document.getElementById('modal-form').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Get Access →';
  }
}
// Close modal on overlay click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('earlyAccessModal');
  if (e.target === modal) closeModal();
});

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
  success.style.display = 'block';
  setTimeout(() => { success.style.display = 'none'; }, 4000);
}

// ===== INIT =====
updatePrices();

// Show dev banner if Sheets not connected
if (SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
  const banner = document.getElementById('setupBanner');
  if (banner) banner.style.display = 'block';
}
