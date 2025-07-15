/**
 * TransactionList handles rendering and filtering of transactions.
 * @module TransactionList
 */
export class TransactionList {
  constructor(transactionService, modalManager, statsPanel, pieChart) {
    this.transactionService = transactionService;
    this.modalManager = modalManager;
    this.statsPanel = statsPanel;
    this.pieChart = pieChart;
    this.DOM = {
      list: document.getElementById('transactions-list'),
      addBtn: document.getElementById('add-transaction-btn'),
      filter: document.getElementById('filter-type'),
      filterMonth: document.getElementById('filter-month'),
      filterYear: document.getElementById('filter-year'),
      form: document.getElementById('transaction-form'),
      modal: document.getElementById('transaction-modal'),
      deleteModal: document.getElementById('delete-modal'),
      cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
      confirmDeleteBtn: document.getElementById('confirm-delete-btn')
    };
    this.state = {
      filter: 'all',
      filterMonth: new Date().getMonth(),
      filterYear: new Date().getFullYear(),
      deleteId: null
    };
  }

  /**
   * Initialize event listeners and render initial list.
   */
  init() {
    this.DOM.addBtn.onclick = () => this.openModal();
    this.DOM.form.onsubmit = e => this.handleFormSubmit(e);
    this.DOM.filter.onchange = e => {
      this.state.filter = e.target.value;
      this.render();
    };
    this.DOM.filterMonth.onchange = e => {
      this.state.filterMonth = Number(e.target.value);
      this.render();
    };
    this.DOM.filterYear.onchange = e => {
      this.state.filterYear = Number(e.target.value);
      this.render();
    };
    this.DOM.list.onclick = (e) => {
      const item = e.target.closest('.transaction-item');
      if (!item) return;
      const id = item.getAttribute('data-id');
      if (e.target.closest('.delete-btn')) {
        this.showDeleteModal(id);
      }
      if (e.target.closest('.edit-btn')) {
        this.openModal(true, id);
      }
    };
    this.DOM.cancelDeleteBtn.onclick = () => this.hideDeleteModal();
    this.DOM.confirmDeleteBtn.onclick = () => {
      if (this.state.deleteId) {
        this.transactionService.deleteTransaction(this.state.deleteId).then(() => this.render());
        this.hideDeleteModal();
      }
    };
    this.render();
    this.statsPanel.render();
    this.pieChart.render();
  }

  /**
   * Render the transaction list.
   */
  async render() {
    await this.transactionService.fetchTransactions();
    const txs = this.getFilteredTransactions();
    this.DOM.list.innerHTML = txs.length
      ? txs.map(t => `
        <div class="transaction-item transaction-${t.type}" data-id="${t._id}">
          <div class="transaction-info">
            <h4>${t.description}</h4>
            <p>${t.category}</p>
          </div>
          <div class="transaction-amount">€${t.amount.toFixed(2)}</div>
          <div class="transaction-actions">
            <button class="btn-action edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-action delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `).join('')
      : `<p style="text-align:center;color:var(--gray)">No transactions yet.</p>`;
    this.populateMonthYearFilters();
    this.statsPanel.render();
    this.pieChart.render();
  }

  /**
   * Get filtered transactions by type, month, and year.
   */
  getFilteredTransactions() {
    return this.transactionService.transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === Number(this.state.filterMonth) && d.getFullYear() === Number(this.state.filterYear)
        && (this.state.filter === 'all' || t.type === this.state.filter);
    });
  }

  /**
   * Populate month/year filter dropdowns.
   */
  populateMonthYearFilters() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.DOM.filterMonth.innerHTML = months.map((m, i) =>
      `<option value="${i}" ${i === this.state.filterMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
    const years = this.transactionService.transactions.length
      ? Array.from(new Set(this.transactionService.transactions.map(t => new Date(t.date).getFullYear()))).sort((a, b) => b - a)
      : [new Date().getFullYear()];
    if (!years.includes(this.state.filterYear)) years.push(this.state.filterYear);
    years.sort((a, b) => b - a);
    this.DOM.filterYear.innerHTML = years.map(y =>
      `<option value="${y}" ${y === this.state.filterYear ? 'selected' : ''}>${y}</option>`
    ).join('');
  }

  /**
   * Open the transaction modal for add/edit.
   */
  openModal(isEdit = false, id = null) {
    this.renderForm(isEdit, id);
    this.modalManager.open('transaction', () => {
      // Only submit if not focused on a button (to avoid double submit)
      if (document.activeElement.tagName !== 'BUTTON') {
        this.DOM.form.requestSubmit();
      }
    });
  }

  /**
   * Render the transaction form for add/edit.
   */
  renderForm(isEdit = false, id = null) {
    const commonCategories = [
      'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Salary', 'Other'
    ];
    let tx = { description: '', amount: '', category: '', type: 'income' };
    if (isEdit && id) {
      tx = this.transactionService.transactions.find(t => t._id === id) || tx;
    }
    const isCustomCategory = tx.category && !commonCategories.includes(tx.category);
    const selectedCategory = isCustomCategory ? 'Other' : tx.category;
    this.DOM.form.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="description">Description</label>
        <input class="form-control" id="description" autocomplete="off" required value="${tx.description}">
      </div>
      <div class="form-group">
        <label class="form-label" for="amount">Amount</label>
        <input class="form-control" id="amount" type="number" step="0.01" autocomplete="off" required value="${tx.amount}">
      </div>
      <div class="form-group">
        <label class="form-label" for="category-select">Category</label>
        <select class="form-control" id="category-select" required>
          ${commonCategories.map(cat => `<option value="${cat}" ${selectedCategory === cat ? 'selected' : ''}>${cat}</option>`).join('')}
        </select>
        <input class="form-control" id="custom-category" placeholder="Enter category" style="margin-top:0.5rem; display:${selectedCategory === 'Other' ? 'block' : 'none'}" value="${isCustomCategory ? tx.category : ''}">
      </div>
      <div class="form-group">
        <label class="form-label" for="type">Type</label>
        <select class="form-control" id="type" required>
          <option value="income" ${tx.type === 'income' ? 'selected' : ''}>Income</option>
          <option value="expense" ${tx.type === 'expense' ? 'selected' : ''}>Expense</option>
        </select>
      </div>
      <button class="btn btn-primary" type="submit">${isEdit ? 'Update' : 'Add'} Transaction</button>
    `;
    this.DOM.form.dataset.edit = isEdit ? id : '';
    const categorySelect = this.DOM.form.querySelector('#category-select');
    const customCategory = this.DOM.form.querySelector('#custom-category');
    categorySelect.onchange = () => {
      if (categorySelect.value === 'Other') {
        customCategory.style.display = 'block';
        customCategory.required = true;
      } else {
        customCategory.style.display = 'none';
        customCategory.required = false;
      }
    };
  }

  /**
   * Handle transaction form submit for add/edit.
   */
  async handleFormSubmit(e) {
    e.preventDefault();
    const categorySelect = this.DOM.form.querySelector('#category-select');
    const customCategory = this.DOM.form.querySelector('#custom-category');
    let category = categorySelect ? categorySelect.value : '';
    if (category === 'Other') {
      category = customCategory.value.trim();
    }
    const tx = {
      description: this.DOM.form.querySelector('#description').value,
      amount: parseFloat(this.DOM.form.querySelector('#amount').value),
      category,
      type: this.DOM.form.querySelector('#type').value
    };
    const editId = this.DOM.form.dataset.edit;
    if (editId) {
      await this.transactionService.updateTransaction(editId, tx);
    } else {
      await this.transactionService.addTransaction(tx);
    }
    this.modalManager.close('transaction');
    this.render();
    this.statsPanel.render();
    this.pieChart.render();
  }

  /**
   * Show the delete confirmation modal.
   */
  showDeleteModal(id) {
    this.state.deleteId = id;
    this.modalManager.open('delete', () => {
      if (this.state.deleteId) {
        this.transactionService.deleteTransaction(this.state.deleteId).then(() => this.render());
        this.hideDeleteModal();
      }
    });
  }
  hideDeleteModal() {
    this.state.deleteId = null;
    this.modalManager.close('delete');
  }
} 