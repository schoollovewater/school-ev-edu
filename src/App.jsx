import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Map from './pages/Map';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import AiAnalyzer from './pages/AiAnalyzer';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<Map />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="ai" element={<AiAnalyzer />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
