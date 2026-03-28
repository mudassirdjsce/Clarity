/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

// ── Auth (Common) ─────────────────────────────────────────────────────────────
import Login  from './pages/common/Login';
import Signup from './pages/common/Signup';
import LandingPage from './pages/common/LandingPage';

// ── User Pages ────────────────────────────────────────────────────────────────
import { UserDashboard }          from './pages/user/Dashboard';
import { Portfolio as UserPortfolio } from './pages/user/Portfolio';
import { Markets   as UserMarkets }   from './pages/user/Markets';
import { Assistant as UserAssistant } from './pages/user/Assistant';
import RetailNews                 from './pages/user/RetailNews';
import UserProfile from './pages/user/Profile';

// ── Company Pages ─────────────────────────────────────────────────────────────
import { CompanyDashboard }             from './pages/company/Dashboard';
import { Portfolio as CompanyPortfolio } from './pages/company/Portfolio';
import { Markets   as CompanyMarkets }   from './pages/company/Markets';
import { Assistant as CompanyAssistant } from './pages/company/Assistant';
import NewsInstitution               from './pages/company/NewsInstitution';
import CompanyProfile from './pages/company/Profile';

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ── Public Auth Routes ──────────────────────────────────────────── */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />

        {/* ── Protected App Routes (inside Layout) ───────────────────────── */}
        <Route path="/" element={<LandingPage />}>
          <Route index element={<Navigate to="/login" replace />} />

          {/* User */}
          <Route path="user">
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="portfolio" element={<UserPortfolio />} />
            <Route path="markets"   element={<UserMarkets />} />
            <Route path="assistant" element={<UserAssistant />} />
            <Route path="news"      element={<RetailNews />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Company */}
          <Route path="company">
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="portfolio" element={<CompanyPortfolio />} />
            <Route path="markets"   element={<CompanyMarkets />} />
            <Route path="assistant" element={<CompanyAssistant />} />
            <Route path="news"      element={<NewsInstitution />} />
            <Route path="profile" element={<CompanyProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>

      </Routes>
    </Router>
  );
}
