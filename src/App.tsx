import ProductTable from "./pages/ProductTable"
import { PrimeReactProvider } from 'primereact/api';
import './App.css';                 

const  App: React.FC = () => {
  return (
      <PrimeReactProvider>
          <ProductTable/>
      </PrimeReactProvider>
  );
}

export default App
