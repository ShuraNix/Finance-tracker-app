/**
 * PieChart handles rendering of the expenses by category pie chart.
 * @module PieChart
 */
export class PieChart {
  constructor(transactionService) {
    this.transactionService = transactionService;
    this.chart = null;
    this.DOM = {
      canvas: document.getElementById('category-pie-chart')
    };
  }

  /**
   * Initialize and render the pie chart.
   */
  init() {
    this.render();
  }

  /**
   * Render the pie chart.
   */
  render() {
    const txs = this.transactionService.transactions.filter(t => t.type === 'expense');
    if (!txs.length) {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      const ctx = this.DOM.canvas.getContext('2d');
      ctx.clearRect(0, 0, 400, 220);
      return;
    }
    const categoryTotals = {};
    txs.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const colors = [
      '#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#4361ee', '#3a86ff', '#8338ec', '#ffbe0b'
    ];
    if (this.chart) this.chart.destroy();
    const ctx = this.DOM.canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          title: { display: true, text: 'Expenses by Category' }
        },
        layout: {
          padding: 10
        }
      }
    });
  }
} 