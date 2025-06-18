import { Routes, Route } from 'react-router-dom';

import { HomePage } from '../../pages/HomePage';
import { GeneratorPage } from '../../pages/GeneratorPage';
import { HistoryPage } from '../../pages/HistoryPage';

import { Header } from '../Header';

export const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </>
  );
};
