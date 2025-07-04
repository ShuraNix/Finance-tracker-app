class NixFundsApp {
  constructor() {
    this.API_URL = 'http://localhost:8000/api/transactions';
    this.state = { transactions: [], filter: 'all' };
    this.DOM = {
      addBtn: document.querySelector('#add-transaction-btn'),
      modal: document.querySelector('#transaction-modal'),
      closeBtn: document.querySelector('.close-modal'),
      form: document.querySelector('#transaction-form'),
      list: document.querySelector('#transactions-list'),
      stats: document.querySelector('.stats-container'),
      filter: document.querySelector('#filter-type'),
      themeToggle: document.querySelector('#theme-toggle'),
      themeIcon: document.querySelector('#theme-toggle i')
    };
    this.init();
  }

  // --- Theme ---
  setTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    this.DOM.themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
  initTheme() {
    this.setTheme(localStorage.getItem('theme') === 'dark');
    this.DOM.themeToggle.onclick = () =>
      this.setTheme(!document.body.classList.contains('dark-mode'));
  }

  // --- Modal ---
  openModal() {
    this.DOM.modal.style.display = 'flex';
    this.renderForm();
  }
  closeModal() {
    this.DOM.modal.style.display = 'none';
    this.DOM.form.reset();
  }

  // --- Form ---
  renderForm() {
    this.DOM.form.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="description">Description</label>
        <input class="form-control" id="description" autocomplete="off" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="amount">Amount</label>
        <input class="form-control" id="amount" type="number" step="0.01" autocomplete="off" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="category">Category</label>
        <input class="form-control" id="category" autocomplete="off" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="type">Type</label>
        <select class="form-control" id="type" required>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <button class="btn btn-primary" type="submit">Add Transaction</button>
    `;
  }

  // --- Transactions ---
  renderTransactions() {
    const txs = this.state.transactions.filter(
      t => this.state.filter === 'all' || t.type === this.state.filter
    );
    this.DOM.list.innerHTML = txs.length
      ? txs.map(t => `
        <div class="transaction-item transaction-${t.type}">
          <div class="transaction-info">
            <h4>${t.description}</h4>
            <p>${t.category}</p>
          </div>
          <div class="transaction-amount">€${t.amount.toFixed(2)}</div>
        </div>
      `).join('')
      : `<p style="text-align:center;color:var(--gray)">No transactions yet.</p>`;
  }

  renderStats() {
    const income = this.state.transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expense = this.state.transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    const balance = income - expense;
    this.DOM.stats.innerHTML = `
      <div class="stat-card">
        <h3>Total Balance</h3>
        <h2>€${balance.toFixed(2)}</h2>
      </div>
      <div class="stat-card">
        <h3>Income</h3>
        <h2 style="color:var(--success)">€${income.toFixed(2)}</h2>
      </div>
      <div class="stat-card">
        <h3>Expenses</h3>
        <h2 style="color:var(--danger)">€${expense.toFixed(2)}</h2>
      </div>
    `;
  }

  // --- API ---
  async fetchTransactions() {
    try {
      const res = await fetch(this.API_URL);
      this.state.transactions = res.ok ? await res.json() : [];
    } catch {
      this.state.transactions = [];
    }
    this.renderTransactions();
    this.renderStats();
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    const tx = {
      description: this.DOM.form.querySelector('#description').value,
      amount: parseFloat(this.DOM.form.querySelector('#amount').value),
      category: this.DOM.form.querySelector('#category').value,
      type: this.DOM.form.querySelector('#type').value
    };
    try {
      const res = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });
      if (res.ok) {
        this.closeModal();
        this.fetchTransactions();
      }
    } catch {}
  }

  // --- Events ---
  setupEvents() {
    this.DOM.addBtn.onclick = () => this.openModal();
    this.DOM.closeBtn.onclick = () => this.closeModal();
    window.onclick = e => { if (e.target === this.DOM.modal) this.closeModal(); };
    this.DOM.form.onsubmit = e => this.handleFormSubmit(e);
    this.DOM.filter.onchange = e => {
      this.state.filter = e.target.value;
      this.renderTransactions();
    };
  }

  // --- Init ---
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEvents();
      this.fetchTransactions();
      this.initTheme();
    });
  }
}

new NixFundsApp();