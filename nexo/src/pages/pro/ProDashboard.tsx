import { useMemo, useState } from 'react';
import { Calendar, TrendingUp, Users, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getServico } from '../../data/mockData';
import { diaNumero, diaSemanaAbrev, formatarMoeda, gerarProximosDias, hojeISO } from '../../utils/date';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';

export default function ProDashboard() {
  const { sessao, agendamentos } = useApp();
  const profissionalId = sessao?.tipo === 'profissional' ? sessao.profissionalId : '';
  const [diaSelecionado, setDiaSelecionado] = useState(hojeISO());

  const meusAgendamentos = useMemo(
    () => agendamentos.filter((a) => a.profissionalId === profissionalId && a.status !== 'cancelado'),
    [agendamentos, profissionalId],
  );

  const proximosDias = useMemo(() => gerarProximosDias(7), []);

  const doDia = meusAgendamentos
    .filter((a) => a.data === diaSelecionado)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const hoje = hojeISO();
  const mesAtual = hoje.slice(0, 7);
  const faturamentoMes = meusAgendamentos
    .filter((a) => a.data.startsWith(mesAtual))
    .reduce((soma, a) => soma + a.valorServico, 0);

  const clientesUnicos = new Set(meusAgendamentos.map((a) => a.clienteId)).size;
  const atendimentosMes = meusAgendamentos.filter((a) => a.data.startsWith(mesAtual)).length;

  return (
    <div className="fade-in pb-8">
      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-2.5">
          <CardStat icone={Wallet} label="Faturamento do mês" valor={formatarMoeda(faturamentoMes)} />
          <CardStat icone={Calendar} label="Atendimentos" valor={String(atendimentosMes)} />
          <CardStat icone={Users} label="Clientes" valor={String(clientesUnicos)} />
        </div>
      </div>

      <section className="mt-6 px-5">
        <h2 className="mb-3 font-display text-base font-semibold">Agenda da semana</h2>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {proximosDias.map((d) => {
            const qtd = meusAgendamentos.filter((a) => a.data === d).length;
            return (
              <button
                key={d}
                onClick={() => setDiaSelecionado(d)}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all ${
                  diaSelecionado === d ? 'bg-blush-700 text-white shadow-soft' : 'bg-white text-ink/70 shadow-soft'
                }`}
              >
                <span className="text-[10px] uppercase opacity-70">{diaSemanaAbrev(d)}</span>
                <span className="text-base font-bold">{diaNumero(d)}</span>
                {qtd > 0 && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${diaSelecionado === d ? 'bg-white' : 'bg-blush-500'}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">
            {diaSelecionado === hoje ? 'Atendimentos de hoje' : 'Atendimentos do dia'}
          </h2>
          <span className="flex items-center gap-1 text-xs text-ink/40">
            <TrendingUp size={12} /> {doDia.length} agendados
          </span>
        </div>

        {doDia.length === 0 ? (
          <EmptyState icone={Calendar} titulo="Nenhum atendimento" descricao="Você não tem horários marcados neste dia." />
        ) : (
          <div className="flex flex-col gap-2.5">
            {doDia.map((a) => {
              const serv = getServico(a.servicoId);
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-soft">
                  <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-blush-50 text-blush-800">
                    <span className="text-sm font-bold leading-none">{a.horaInicio}</span>
                    <span className="mt-0.5 text-[10px] text-blush-500">{a.horaFim}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{serv?.nome}</p>
                    <p className="text-xs text-ink/45">{formatarMoeda(a.valorServico)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function CardStat({ icone: Icone, label, valor }: { icone: typeof Wallet; label: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-white p-3 shadow-soft">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blush-50 text-blush-700">
        <Icone size={13} />
      </span>
      <span className="text-[11px] leading-tight text-ink/45">{label}</span>
      <span className="text-sm font-bold leading-tight text-ink">{valor}</span>
    </div>
  );
}
