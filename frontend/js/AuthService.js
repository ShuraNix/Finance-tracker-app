/**
 * AuthService handles authentication, login, signup, and logout.
 * @module AuthService
 */
export class AuthService {
  constructor(modalManager) {
    this.modalManager = modalManager;
    this.token = localStorage.getItem('token') || null;
    this.email = localStorage.getItem('email') || null;
    this.authMode = 'login';
    this.DOM = {
      authModal: document.getElementById('auth-modal'),
      authForm: document.getElementById('auth-form'),
      authEmail: document.getElementById('auth-email'),
      authPassword: document.getElementById('auth-password'),
      authSubmitBtn: document.getElementById('auth-submit-btn'),
      toggleAuthMode: document.getElementById('toggle-auth-mode'),
      authError: document.getElementById('auth-error'),
      closeAuthModal: document.getElementById('close-auth-modal'),
      headerAvatar: document.getElementById('header-avatar'),
      userDropdown: document.getElementById('header-user-dropdown'),
      logoutBtn: document.getElementById('logout-btn')
    };
  }

  /**
   * Initialize auth event listeners and UI.
   */
  init() {
    this.DOM.authForm.onsubmit = e => this.handleAuthSubmit(e);
    this.DOM.toggleAuthMode.onclick = () => this.toggleAuthModeFn();
    this.DOM.closeAuthModal.onclick = () => this.modalManager.closeAll();
    this.DOM.logoutBtn.onclick = () => this.logout();
    this.DOM.headerAvatar.onclick = () => this.toggleUserDropdown();
    this.updateHeaderAvatar();
    if (!this.token) this.showAuthModal('login');
  }

  /**
   * Handle login/signup form submit.
   */
  async handleAuthSubmit(e) {
    e.preventDefault();
    const email = this.DOM.authEmail.value.trim();
    const password = this.DOM.authPassword.value;
    const mode = this.authMode;
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch('http://localhost:8000' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        this.token = data.token;
        this.email = data.email;
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        this.modalManager.closeAll();
        this.updateHeaderAvatar();
        window.toastManager && window.toastManager.show('Login successful!', 'success');
      } else {
        this.DOM.authError.textContent = data.message || 'Authentication failed';
        this.DOM.authError.style.display = 'block';
        window.toastManager && window.toastManager.show(this.DOM.authError.textContent, 'error');
      }
    } catch {
      this.DOM.authError.textContent = 'Network error';
      this.DOM.authError.style.display = 'block';
      window.toastManager && window.toastManager.show('Network error', 'error');
    }
  }

  /**
   * Show the auth modal.
   * @param {string} mode
   */
  showAuthModal(mode = 'login') {
    this.authMode = mode;
    this.DOM.authModal.style.display = 'flex';
    this.DOM.authSubmitBtn.textContent = mode === 'login' ? 'Login' : 'Sign Up';
    this.DOM.authModal.querySelector('#auth-modal-title').textContent = mode === 'login' ? 'Login' : 'Sign Up';
    this.DOM.toggleAuthMode.textContent = mode === 'login'
      ? "Don't have an account? Sign up"
      : "Already have an account? Login";
    this.DOM.authError.style.display = 'none';
    this.DOM.authForm.reset();
    this.updateHeaderAvatar();
  }

  /**
   * Toggle between login and signup mode.
   */
  toggleAuthModeFn() {
    this.showAuthModal(this.authMode === 'login' ? 'signup' : 'login');
  }

  /**
   * Log out the user.
   */
  logout() {
    this.token = null;
    this.email = null;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.showAuthModal('login');
    this.updateHeaderAvatar();
    this.toggleUserDropdown(true);
    window.toastManager && window.toastManager.show('Logged out', 'success');
  }

  /**
   * Update the header avatar with user initials.
   */
  updateHeaderAvatar() {
    if (this.token && this.email) {
      const initials = this.email
        .split('@')[0]
        .split(/[._-]/)
        .map(s => s[0] ? s[0].toUpperCase() : '')
        .join('').slice(0,2);
      this.DOM.headerAvatar.textContent = initials || 'U';
      this.DOM.headerAvatar.style.display = 'flex';
    } else {
      this.DOM.headerAvatar.style.display = 'none';
      this.DOM.userDropdown.classList.remove('active');
      this.userDropdownOpen = false;
    }
  }

  /**
   * Toggle the user dropdown menu.
   */
  toggleUserDropdown(forceClose = false) {
    if (forceClose || this.userDropdownOpen) {
      this.DOM.userDropdown.classList.remove('active');
      this.userDropdownOpen = false;
    } else {
      this.DOM.userDropdown.classList.add('active');
      this.userDropdownOpen = true;
      this.DOM.userDropdown.querySelector('button').focus();
    }
  }
} 