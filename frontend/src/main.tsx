import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initApp } from './utils/init'

async function startApp() {
  // Only start MSW in development
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
  try {
  await initApp();
    
  // Render React app
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Failed to start application:', error);
    
    // Render app anyway - it should still work even if init fails
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

// Start the app
startApp();
