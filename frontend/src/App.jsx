/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import WrappedPage          from './pages/common/WrappedPage';

// ── Auth (Common) ─────────────────────────────────────────────────────────────
import Login       from './pages/common/Login';
import Signup      from './pages/common/Signup';
import LandingPage from './pages/common/LandingPage';

// ── User Pages ────────────────────────────────────────────────────────────────
import { UserDashboard }              from './pages/user/Dashboard';
import { Portfolio as UserPortfolio } from './pages/user/Portfolio';
import { Markets   as UserMarkets }   from './pages/user/Markets';
import RetailNews                     from './pages/user/RetailNews';
import { Assistant as UserAssistant } from './pages/user/Assistant';
import UserProfile                    from './pages/user/Profile';
import GamifiedLearningPath           from './pages/user/GamifiedLearningPath';
import Stocks                         from './pages/user/Stocks';
import MutualFunds                    from './pages/user/MutualFunds';
import StockDetail                    from './pages/user/StockDetail';
import MutualFundDetail               from './pages/user/MutualFundDetail';

// ── Company Pages ─────────────────────────────────────────────────────────────
import { CompanyDashboard }              from './pages/company/Dashboard';
import { Portfolio as CompanyPortfolio } from './pages/company/Portfolio';
import { Markets   as CompanyMarkets }   from './pages/company/Markets';
import NewsInstitution                   from './pages/company/NewsInstitution';
import { Assistant as CompanyAssistant } from './pages/company/Assistant';
import CompanyProfile                    from './pages/company/Profile';

// ── Private Route Guard ───────────────────────────────────────────────────────
function PrivateRoute() {
  const user = localStorage.getItem('clarity_user');
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Routes>

        {/* ── Public Routes ─────────────────────────────────────────────── */}
        <Route path="/"       element={<LandingPage />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Protected Routes (auth-gated, inside Layout with Sidebar) ─── */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>

            {/* Retail / User */}
            <Route path="user">
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="portfolio" element={<UserPortfolio />} />
              <Route path="markets"   element={<UserMarkets />} />
              <Route path="assistant" element={<UserAssistant />} />
              <Route path="news"      element={<RetailNews />} />
              <Route path="profile"   element={<UserProfile />} />
              <Route path="academy"   element={<GamifiedLearningPath />} />
              <Route path="wrapped"   element={<WrappedPage />} />
              <Route path="stocks"    element={<Stocks />} />
              <Route path="mutualfunds" element={<MutualFunds />} />
              <Route path="stock/:ticker"     element={<StockDetail />} />
              <Route path="mutualfund/:slug"  element={<MutualFundDetail />} />
            </Route>

            {/* Institution / Company */}
            <Route path="company">
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="portfolio" element={<CompanyPortfolio />} />
              <Route path="markets"   element={<CompanyMarkets />} />
              <Route path="assistant" element={<CompanyAssistant type="company" />} />
              <Route path="news"      element={<NewsInstitution />} />
              <Route path="profile"   element={<CompanyProfile />} />
              <Route path="stocks"       element={<Stocks />} />
              <Route path="mutualfunds"  element={<MutualFunds />} />
              <Route path="mutualfund/:slug" element={<MutualFundDetail />} />
              <Route path="wrapped"   element={<WrappedPage />} />
            </Route>

          </Route>
        </Route>

        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}
