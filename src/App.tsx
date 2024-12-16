import ProductTable from "./pages/ProductTable"
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Optional: Choose a theme
import 'primereact/resources/primereact.min.css'; // Required: Core styles for PrimeReact
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import './App.css';                 // PrimeIcons CSS

const  App: React.FC = () => {
  return (
      <PrimeReactProvider>
          <ProductTable/>
      </PrimeReactProvider>
  );
}

export default App
