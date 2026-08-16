import { useMemo, useState } from 'react';
import { Calendar, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getProfissional, getServico } from '../data/mockData';
import { calcularHoraFim, gerarHorariosDisponiveis } from '../utils/disponibilidade';
import {
  diaNumero,
  diaSemanaAbrev,
  formatarDataLabel,
  formatarMoeda,
  gerarProximosDias,
} from '../utils/date';
import type { Agendamento } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Sheet from '../components/ui/Sheet';
import EmptyState from '../components/ui/EmptyState';

export default function Appointments() {
  const { agendamentos, cancelarAgendamento, remarcarAgendamento, adicionarAvaliacao, notificar } = useApp();
  const [aba, setAba] = useState<'proximos' | 'historico'>('proximos');
  const [agendamentoRemarcar, setAgendamentoRemarcar] = useState<Agendamento | null>(null);
  const [agendamentoAvaliar, setAgendamentoAvaliar] = useState<Agendamento | null>(null);
  const [agendamentoCancelar, setAgendamentoCancelar] = useState<Agendamento | null>(null);

  const meus = agendamentos.filter((a) => a.clienteId === 'cliente-1');
  const proximos = meus
    .filter((a) => a.status === 'confirmado')
    .sort((a, b) => (a.data + a.horaInicio).localeCompare(b.data + b.horaInicio));
  const historico = meus
    .filter((a) => a.status !== 'confirmado')
    .sort((a, b) => (b.data + b.horaInicio).localeCompare(a.data + a.horaInicio));

  const lista = aba === 'proximos' ? proximos : historico;

  return (
    <div className="fade-in pb-8">
      <header className="px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-xl font-semibold">Meus agendamentos</h1>
        <div className="mt-4 flex gap-2 rounded-full bg-blush-50 p-1">
          {(
            [
              ['proximos', 'Próximos'],
              ['historico', 'Histórico'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                aba === id ? 'bg-white text-blush-800 shadow-soft' : 'text-ink/45'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <section className="mt-2 flex flex-col gap-3 px-5">
        {lista.length === 0 ? (
          <EmptyState
            icone={Calendar}
            titulo={aba === 'proximos' ? 'Nenhum agendamento próximo' : 'Nenhum histórico ainda'}
            descricao="Explore profissionais e agende seu próximo cuidado."
          />
        ) : (
          lista.map((ag) => {
            const prof = getProfissional(ag.profissionalId);
            const serv = getServico(ag.servicoId);
            if (!prof || !serv) return null;
            return (
              <div key={ag.id} className="rounded-3xl bg-white p-4 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-blush-50">
                    <span className="text-[10px] uppercase leading-none text-blush-500">{diaSemanaAbrev(ag.data)}</span>
                    <span className="text-base font-bold leading-none text-blush-800">{diaNumero(ag.data)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold leading-tight">{serv.nome}</p>
                      <StatusBadge status={ag.status} />
                    </div>
                    <p className="truncate text-xs text-ink/50">{prof.nome}</p>
                    <p className="mt-1 text-xs font-medium text-ink/60">
                      {formatarDataLabel(ag.data)} · {ag.horaInicio} · {formatarMoeda(ag.valorTotal)}
                    </p>
                  </div>
                </div>

                {ag.status === 'confirmado' && (
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" className="flex-1 !py-2 text-xs" onClick={() => setAgendamentoRemarcar(ag)}>
                      Remarcar
                    </Button>
                    <Button variant="ghost" className="flex-1 !py-2 text-xs text-red-500" onClick={() => setAgendamentoCancelar(ag)}>
                      Cancelar
                    </Button>
                  </div>
                )}

                {ag.status === 'concluido' && !ag.avaliado && (
                  <div className="mt-3">
                    <Button variant="secondary" className="w-full !py-2 text-xs" icon={<Star size={13} />} onClick={() => setAgendamentoAvaliar(ag)}>
                      Avaliar atendimento
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Cancelar */}
      <Sheet aberto={!!agendamentoCancelar} onFechar={() => setAgendamentoCancelar(null)} titulo="Cancelar agendamento">
        {agendamentoCancelar && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink/60">
              Tem certeza que deseja cancelar este agendamento? Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setAgendamentoCancelar(null)}>
                Voltar
              </Button>
              <Button
                fullWidth
                className="!bg-red-500 hover:!bg-red-600"
                onClick={() => {
                  cancelarAgendamento(agendamentoCancelar.id);
                  notificar('Agendamento cancelado.', 'info');
                  setAgendamentoCancelar(null);
                }}
              >
                Cancelar horário
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* Remarcar */}
      <RemarcarSheet
        agendamento={agendamentoRemarcar}
        onFechar={() => setAgendamentoRemarcar(null)}
        onConfirmar={(data, hora, fim) => {
          if (!agendamentoRemarcar) return;
          remarcarAgendamento(agendamentoRemarcar.id, data, hora, fim);
          notificar('Agendamento remarcado com sucesso!');
          setAgendamentoRemarcar(null);
        }}
      />

      {/* Avaliar */}
      <AvaliarSheet
        agendamento={agendamentoAvaliar}
        onFechar={() => setAgendamentoAvaliar(null)}
        onEnviar={(nota, comentario) => {
          if (!agendamentoAvaliar) return;
          adicionarAvaliacao({
            agendamentoId: agendamentoAvaliar.id,
            profissionalId: agendamentoAvaliar.profissionalId,
            servicoId: agendamentoAvaliar.servicoId,
            nota,
            comentario,
          });
          notificar('Obrigada pela sua avaliação! 💕');
          setAgendamentoAvaliar(null);
        }}
      />
    </div>
  );
}

function RemarcarSheet({
  agendamento,
  onFechar,
  onConfirmar,
}: {
  agendamento: Agendamento | null;
  onFechar: () => void;
  onConfirmar: (data: string, hora: string, fim: string) => void;
}) {
  const { agendamentos, getConfiguracaoAgenda } = useApp();
  const [data, setData] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const dias = useMemo(() => gerarProximosDias(14), []);

  const prof = agendamento ? getProfissional(agendamento.profissionalId) : undefined;
  const serv = agendamento ? getServico(agendamento.servicoId) : undefined;

  const horarios = useMemo(() => {
    if (!prof || !serv || !data) return [];
    return gerarHorariosDisponiveis(
      prof.id,
      getConfiguracaoAgenda(prof.id),
      data,
      serv.duracaoMin,
      agendamentos.filter((a) => a.id !== agendamento?.id),
    );
  }, [prof, serv, data, agendamentos, agendamento?.id, getConfiguracaoAgenda]);

  if (!agendamento || !prof || !serv) return null;

  return (
    <Sheet
      aberto={!!agendamento}
      onFechar={() => {
        setData(null);
        setHora(null);
        onFechar();
      }}
      titulo="Remarcar horário"
    >
      <p className="mb-3 text-sm text-ink/50">Escolha a nova data</p>
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
        {dias.map((d) => (
          <button
            key={d}
            onClick={() => {
              setData(d);
              setHora(null);
            }}
            className={`flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-3.5 py-2.5 ${
              data === d ? 'bg-blush-700 text-white' : 'bg-white text-ink/70 shadow-soft'
            }`}
          >
            <span className="text-[10px] uppercase opacity-70">{diaSemanaAbrev(d)}</span>
            <span className="text-sm font-bold">{diaNumero(d)}</span>
          </button>
        ))}
      </div>

      {data && (
        <>
          <p className="mb-3 mt-4 text-sm text-ink/50">Escolha o novo horário</p>
          {horarios.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink/40">Sem horários disponíveis nesta data.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {horarios.map((h) => (
                <button
                  key={h}
                  onClick={() => setHora(h)}
                  className={`rounded-xl py-2.5 text-xs font-semibold ${
                    hora === h ? 'bg-blush-700 text-white' : 'bg-white text-ink/70 shadow-soft'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Button
        fullWidth
        className="mt-5"
        disabled={!data || !hora}
        onClick={() => data && hora && onConfirmar(data, hora, calcularHoraFim(hora, serv.duracaoMin))}
      >
        Confirmar novo horário
      </Button>
    </Sheet>
  );
}

function AvaliarSheet({
  agendamento,
  onFechar,
  onEnviar,
}: {
  agendamento: Agendamento | null;
  onFechar: () => void;
  onEnviar: (nota: number, comentario: string) => void;
}) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');

  if (!agendamento) return null;
  const serv = getServico(agendamento.servicoId);
  const prof = getProfissional(agendamento.profissionalId);

  return (
    <Sheet
      aberto={!!agendamento}
      onFechar={() => {
        setNota(5);
        setComentario('');
        onFechar();
      }}
      titulo="Avaliar atendimento"
    >
      <p className="text-sm text-ink/60">
        {serv?.nome} com {prof?.nome}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} onClick={() => setNota(i + 1)}>
            <Star size={30} className={i < nota ? 'fill-gold-500 text-gold-500' : 'text-blush-200'} />
          </button>
        ))}
      </div>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Conte como foi sua experiência..."
        rows={4}
        className="mt-4 w-full resize-none rounded-2xl bg-white p-4 text-sm shadow-soft outline-none placeholder:text-ink/35"
      />
      <Button fullWidth className="mt-4" onClick={() => onEnviar(nota, comentario)}>
        Enviar avaliação
      </Button>
    </Sheet>
  );
}
