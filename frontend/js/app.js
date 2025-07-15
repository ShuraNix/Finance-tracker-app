/**
 * Main entry point for NixFunds frontend app.
 * Orchestrates all modules and manages global state.
 *
 * @module App
 */
/**
 * ThemeManager handles dark mode toggling and persistence.
 */
class ThemeManager {
  constructor() {
    this.DOM = {
      themeToggle: document.getElementById('theme-toggle'),
      themeIcon: document.querySelector('#theme-toggle i')
    };
  }
  init() {
    this.setTheme(localStorage.getItem('theme') === 'dark');
    this.DOM.themeToggle.onclick = () =>
      this.setTheme(!document.body.classList.contains('dark-mode'));
  }
  setTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    if (this.DOM.themeIcon) {
      this.DOM.themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
}

/**
 * ToastManager handles toast notifications for user feedback.
 */
export class ToastManager {
  constructor() {
    this.toast = null;
    this.timeout = null;
    this.createToastElement();
  }
  createToastElement() {
    this.toast = document.createElement('div');
    this.toast.className = 'toast';
    document.body.appendChild(this.toast);
  }
  show(message, type = 'success', duration = 3000) {
    this.toast.textContent = message;
    this.toast.className = `toast show toast-${type}`;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.hide(), duration);
  }
  hide() {
    this.toast.className = 'toast';
  }
}

import { ModalManager } from './ModalManager.js';
import { TransactionService } from './TransactionService.js';
import { AuthService } from './AuthService.js';
import { TransactionList } from './TransactionList.js';
import { StatsPanel } from './StatsPanel.js';
import { PieChart } from './PieChart.js';

class App {
  /**
   * Initializes the NixFunds App and all modules.
   */
  constructor() {
    this.themeManager = new ThemeManager();
    this.toastManager = new ToastManager();
    window.toastManager = this.toastManager; // Make globally accessible
    this.modalManager = new ModalManager();
    this.transactionService = new TransactionService();
    this.statsPanel = new StatsPanel(this.transactionService);
    this.pieChart = new PieChart(this.transactionService);
    this.authService = new AuthService(this.modalManager);
    // Pass statsPanel and pieChart to TransactionList for coordinated UI updates
    this.transactionList = new TransactionList(
      this.transactionService,
      this.modalManager,
      this.statsPanel,
      this.pieChart
    );
    this.init();
  }

  /**
   * Sets up event listeners and initial UI state.
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.themeManager.init();
      this.authService.init();
      this.transactionList.init();
      this.statsPanel.init();
      this.pieChart.init();
      this.modalManager.init();
    });
  }
}

new App();