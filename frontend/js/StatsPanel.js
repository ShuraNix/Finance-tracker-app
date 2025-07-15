/**
 * StatsPanel handles rendering of the stats cards.
 * @module StatsPanel
 */
export class StatsPanel {
  constructor(transactionService) {
    this.transactionService = transactionService;
    this.DOM = {
      stats: document.querySelector('.stats-container')
    };
  }

  /**
   * Initialize and render stats.
   */
  init() {
    this.render();
  }

  /**
   * Render the stats cards.
   */
  render() {
    const txs = this.transactionService.transactions;
    const income = txs.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
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
} 