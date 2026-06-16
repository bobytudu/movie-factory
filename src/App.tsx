import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Topbar from './components/Topbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import ScrapperPage from './pages/ScrapperPage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1', // Indigo
          colorBgBase: '#020617',  // Slate 950
          colorBgContainer: '#0f172a', // Slate 900
          colorBorder: '#1e293b',  // Slate 800
          borderRadius: 12,
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
        },
        components: {
          Select: {
            optionSelectedBg: '#1e1b4b', // Indigo-950
            optionActiveBg: '#312e81', // Indigo-900
            colorBgContainer: '#0f172a',
            colorBorder: '#1e293b',
          },
          Pagination: {
            itemBg: '#0f172a',
            itemActiveBg: '#6366f1',
            colorBgContainer: '#0f172a',
          },
        },
      }}
    >
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
          
          {/* Header */}
          <Topbar />

          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/scrapper" element={<ScrapperPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-500 text-sm">
            <div className="max-w-7xl mx-auto px-4">
              <p className="mb-2">© {new Date().getFullYear()} Movie Factory. All rights reserved.</p>
              <p className="text-slate-650 text-xs">
                Designed with React, Vite, Ant Design, and Tailwind CSS.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
