import { default as HomePage } from './pages/home/home';
import { default as MB1001 } from './pages/Screens/MB1001';
import { default as MB1003 } from './pages/Screens/MB1003';
import { default as MB1004 } from './pages/Screens/MB1004';
import MB1005 from './pages/Screens/MB1005';

export default [
  {
    path: '/home',
    component: HomePage
  },
  {
    path: '/MB1001',
    component: MB1001
  },
  {
    path: '/MB1003',
    component: MB1003
  },
  {
    path: '/MB1004',
    component: MB1004
  },
  {
    path: '/MB1005',
    component: MB1005
  }
  ];
