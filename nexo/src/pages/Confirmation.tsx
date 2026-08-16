import { CheckCircle2, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProfissional, getServico } from '../data/mockData';
import { formatarDataLabel, formatarMoeda } from '../utils/date';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function Confirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agendamentos } = useApp();

  const agendamento = agendamentos.find((a) => a.id === id);
  if (!agendamento) {
    return <EmptyState icone={Home} titulo="Agendamento não encontrado" />;
  }

  const profissional = getProfissional(agendamento.profissionalId);
  const servico = getServico(agendamento.servicoId);

  return (
    <div className="fade-in flex min-h-svh flex-col items-center justify-center px-6 pb-10 pt-[max(2rem,env(safe-area-inset-top))] text-center">
      <div className="scale-in flex h-20 w-20 items-center justify-center rounded-full bg-blush-100 text-blush-700">
        <CheckCircle2 size={40} strokeWidth={1.6} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold">Agendamento confirmado! 💕</h1>
      <p className="mt-1 text-sm text-ink/55">Enviamos os detalhes para o seu e-mail.</p>

      <div className="mt-6 w-full max-w-sm rounded-3xl bg-white p-5 text-left shadow-soft-lg">
        <p className="text-center text-xs text-ink/40">Nº do agendamento</p>
        <p className="text-center font-display text-lg font-semibold text-blush-800">#{agendamento.id.slice(-6).toUpperCase()}</p>
        <div className="mt-4 gold-divider" />
        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
          <Linha label="Serviço" valor={servico?.nome ?? ''} />
          <Linha label="Profissional" valor={profissional?.nome ?? ''} />
          <Linha label="Data" valor={formatarDataLabel(agendamento.data)} />
          <Linha label="Horário" valor={agendamento.horaInicio} />
          <Linha label="Valor pago" valor={formatarMoeda(agendamento.valorTotal)} />
        </dl>
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Button fullWidth onClick={() => navigate('/agendamentos')}>
          Ver meus agendamentos
        </Button>
        <Button fullWidth variant="ghost" onClick={() => navigate('/')}>
          Voltar ao início
        </Button>
      </div>
    </div>
  );
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink/45">{label}</dt>
      <dd className="font-medium text-ink">{valor}</dd>
    </div>
  );
}
