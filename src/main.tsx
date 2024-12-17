import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import "primereact/resources/themes/viva-light/theme.css";
import App from './App';


createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <PrimeReactProvider>
    <App />
    </PrimeReactProvider>
  </StrictMode>,
  
)
