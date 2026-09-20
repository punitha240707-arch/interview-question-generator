import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

function renderApp(container: HTMLElement) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

const container = document.getElementById('root');
if (container) {
  renderApp(container);
} else {
  window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('root') || document.body;
    renderApp(el);
  });
}
