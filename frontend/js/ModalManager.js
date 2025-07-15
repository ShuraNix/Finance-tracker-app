/**
 * ModalManager handles all modal dialogs in the app.
 * @module ModalManager
 */
export class ModalManager {
  constructor() {
    this.modals = {
      transaction: document.getElementById('transaction-modal'),
      auth: document.getElementById('auth-modal'),
      delete: document.getElementById('delete-modal')
    };
    this.closeBtns = document.querySelectorAll('.close-modal');
    this._keyHandler = null;
    this._enterHandler = null;
  }

  /**
   * Initialize modal event listeners.
   */
  init() {
    this.closeBtns.forEach(btn => {
      btn.onclick = () => this.closeAll();
    });
    window.onclick = e => {
      Object.values(this.modals).forEach(modal => {
        if (e.target === modal) modal.style.display = 'none';
      });
    };
  }

  /**
   * Open a modal by key.
   * @param {string} key - 'transaction', 'auth', or 'delete'
   * @param {function} [onEnter] - Optional handler for Enter key
   */
  open(key, onEnter) {
    if (this.modals[key]) {
      this.modals[key].style.display = 'flex';
      this._enterHandler = typeof onEnter === 'function' ? onEnter : null;
      this._keyHandler = (e) => {
        if (e.key === 'Escape') {
          this.close(key);
        } else if (e.key === 'Enter' && this._enterHandler) {
          // Only trigger if not inside a textarea or input (except for auth/transaction forms)
          if (document.activeElement.tagName !== 'TEXTAREA') {
            this._enterHandler();
          }
        }
      };
      document.addEventListener('keydown', this._keyHandler);
    }
  }

  /**
   * Close a specific modal by key.
   */
  close(key) {
    if (this.modals[key]) this.modals[key].style.display = 'none';
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
      this._enterHandler = null;
    }
  }

  /**
   * Close all modals.
   */
  closeAll() {
    Object.values(this.modals).forEach(modal => (modal.style.display = 'none'));
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
      this._enterHandler = null;
    }
  }
} 