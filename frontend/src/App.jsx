/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

// User Pages
import { UserDashboard } from './pages/user/Dashboard';
import { Portfolio as UserPortfolio } from './pages/user/Portfolio';
import { Markets as UserMarkets } from './pages/user/Markets';
import { Assistant as UserAssistant } from './pages/user/Assistant';

// Company Pages
import { CompanyDashboard } from './pages/company/Dashboard';
import { Portfolio as CompanyPortfolio } from './pages/company/Portfolio';
import { Markets as CompanyMarkets } from './pages/company/Markets';
import { Assistant as CompanyAssistant } from './pages/company/Assistant';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          
          {/* User Routes */}
          <Route path="user">
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="portfolio" element={<UserPortfolio />} />
            <Route path="markets" element={<UserMarkets />} />
            <Route path="assistant" element={<UserAssistant />} />
          </Route>

          {/* Company Routes */}
          <Route path="company">
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="portfolio" element={<CompanyPortfolio />} />
            <Route path="markets" element={<CompanyMarkets />} />
            <Route path="assistant" element={<CompanyAssistant />} />
          </Route>

          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
