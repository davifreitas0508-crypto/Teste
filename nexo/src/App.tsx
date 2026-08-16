import { Navigate, Route, HashRouter, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ToastHost from './components/ToastHost';
import ClientLayout from './layouts/ClientLayout';
import ProLayout from './layouts/ProLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProfessionalProfile from './pages/ProfessionalProfile';
import BookingFlow from './pages/BookingFlow';
import Confirmation from './pages/Confirmation';
import Appointments from './pages/Appointments';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import ProDashboard from './pages/pro/ProDashboard';
import ProServices from './pages/pro/ProServices';
import ProClients from './pages/pro/ProClients';
import ProReviews from './pages/pro/ProReviews';
import ProSettings from './pages/pro/ProSettings';

function RoteamentoPrivado() {
  const { sessao } = useApp();

  if (!sessao) {
    return (
      <Routes>
        <Route path="/entrar" element={<Login />} />
        <Route path="*" element={<Navigate to="/entrar" replace />} />
      </Routes>
    );
  }

  if (sessao.tipo === 'profissional') {
    return (
      <Routes>
        <Route path="/entrar" element={<Login />} />
        <Route path="/pro" element={<ProLayout />}>
          <Route index element={<ProDashboard />} />
          <Route path="servicos" element={<ProServices />} />
          <Route path="clientes" element={<ProClients />} />
          <Route path="avaliacoes" element={<ProReviews />} />
          <Route path="configuracoes" element={<ProSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/pro" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/entrar" element={<Login />} />
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/agendamentos" element={<Appointments />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
      <Route path="/profissional/:id" element={<ProfessionalProfile />} />
      <Route path="/agendar/:servicoId" element={<BookingFlow />} />
      <Route path="/confirmacao/:id" element={<Confirmation />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastHost />
      <HashRouter>
        <RoteamentoPrivado />
      </HashRouter>
    </AppProvider>
  );
}
