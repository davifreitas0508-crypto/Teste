import { Navigate, Route, Routes } from 'react-router-dom';
import { CobraeProvider, useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Cobrancas from './pages/Cobrancas';
import NovaCobranca from './pages/NovaCobranca';
import Configuracoes from './pages/Configuracoes';

function PrivateArea() {
  const { empresa } = useStore();
  if (!empresa) return <Navigate to="/login" replace />;
  return <Layout />;
}

function CobraeRoutes() {
  const { empresa } = useStore();

  return (
    <Routes>
      <Route path="/login" element={empresa ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<PrivateArea />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/cobrancas" element={<Cobrancas />} />
        <Route path="/nova-cobranca" element={<NovaCobranca />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <CobraeProvider>
      <CobraeRoutes />
    </CobraeProvider>
  );
}
