import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { BackToTop } from '../../components/BackToTop';
import { IntegrationsOverview } from './IntegrationsOverview';
import { WordPressIntegrationPage } from './WordPressIntegrationPage';
import { ShopifyIntegrationPage } from './ShopifyIntegrationPage';
import { APIIntegrationPage } from './APIIntegrationPage';

export function IntegrationsPage() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Routes>
          <Route index element={<IntegrationsOverview />} />
          <Route path="wordpress" element={<WordPressIntegrationPage />} />
          <Route path="shopify" element={<ShopifyIntegrationPage />} />
          <Route path="api" element={<APIIntegrationPage />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}