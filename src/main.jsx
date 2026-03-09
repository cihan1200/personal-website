import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// StrictMode intentionally omitted — it double-invokes effects in dev,
// which would initialize the Three.js scene twice.
createRoot(document.getElementById('root')).render(<App />);