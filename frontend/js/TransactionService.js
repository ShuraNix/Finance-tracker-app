/**
 * TransactionService handles all transaction API calls and state.
 * @module TransactionService
 */
export class TransactionService {
  constructor() {
    this.API_URL = 'http://localhost:8000/api/transactions';
    this.token = localStorage.getItem('token') || null;
    this.transactions = [];
  }

  /**
   * Set the JWT token for API requests.
   * @param {string} token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  /**
   * Fetch all transactions for the user.
   * @returns {Promise<Array>}
   */
  async fetchTransactions() {
    if (!this.token) return [];
    try {
      const res = await fetch(this.API_URL, { headers: this.getAuthHeaders() });
      this.transactions = res.ok ? await res.json() : [];
      return this.transactions;
    } catch {
      this.transactions = [];
      return [];
    }
  }

  /**
   * Add a new transaction.
   * @param {Object} tx
   */
  async addTransaction(tx) {
    if (!this.token) return;
    try {
      const res = await fetch(this.API_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tx)
      });
      if (res.ok) {
        window.toastManager && window.toastManager.show('Transaction added!', 'success');
      } else {
        const data = await res.json();
        window.toastManager && window.toastManager.show(data.message || 'Failed to add transaction', 'error');
      }
    } catch {
      window.toastManager && window.toastManager.show('Network error', 'error');
    }
    return this.fetchTransactions();
  }

  /**
   * Update a transaction.
   * @param {string} id
   * @param {Object} tx
   */
  async updateTransaction(id, tx) {
    if (!this.token) return;
    try {
      const res = await fetch(`${this.API_URL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tx)
      });
      if (res.ok) {
        window.toastManager && window.toastManager.show('Transaction updated!', 'success');
      } else {
        const data = await res.json();
        window.toastManager && window.toastManager.show(data.message || 'Failed to update transaction', 'error');
      }
    } catch {
      window.toastManager && window.toastManager.show('Network error', 'error');
    }
    return this.fetchTransactions();
  }

  /**
   * Delete a transaction.
   * @param {string} id
   */
  async deleteTransaction(id) {
    if (!this.token) return;
    try {
      const res = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        window.toastManager && window.toastManager.show('Transaction deleted!', 'success');
      } else {
        const data = await res.json();
        window.toastManager && window.toastManager.show(data.message || 'Failed to delete transaction', 'error');
      }
    } catch {
      window.toastManager && window.toastManager.show('Network error', 'error');
    }
    return this.fetchTransactions();
  }

  /**
   * Get headers for API requests.
   */
  getAuthHeaders() {
    return this.token
      ? { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
      : { 'Content-Type': 'application/json' };
  }
} 