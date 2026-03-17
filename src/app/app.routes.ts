import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'funds', pathMatch: 'full' },
  {
    path: 'funds',
    loadComponent: () => import('./features/funds/funds-list.page').then((m) => m.FundsListPage),
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./features/portfolio/portfolio.page').then((m) => m.PortfolioPage),
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history.page').then((m) => m.HistoryPage),
  },
  { path: '**', redirectTo: 'funds' },
];
