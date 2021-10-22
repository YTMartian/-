import React from 'react';

const Home = React.lazy(() => import('./pages/Home/Home'));
const CTW1500 = React.lazy(() => import('./pages/Visualization/CTW1500/CTW1500'));
const ICDAR2019 = React.lazy(() => import('./pages/Visualization/ICDAR2019/ICDAR2019LSVT'));

const routes = [
    {path: '/', exact: true, name: '主页', component: Home},
    // { path: '/ProjectManage', name: '工程管理', component: ProjectList, exact: true },
    {path: '/Visualization/CTW1500', exact: true, name: 'CTW1500', component: CTW1500},
    {path: '/Visualization/ICDAR2019', exact: true, name: 'ICDAR2019 LSVT', component: ICDAR2019},
];

export default routes;
