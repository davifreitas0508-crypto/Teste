import { useMemo, useState } from 'react';
import { ArrowLeft, Banknote, Calendar, CreditCard, QrCode } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProfissional } from '../data/mockData';
import { gerarHorariosDisponiveis, calcularHoraFim } from '../utils/disponibilidade';
import {
  diaNumero,
  diaSemanaAbrev,
  formatarDataLabel,
  formatarDuracao,
  formatarMoeda,
  gerarProximosDias,
} from '../utils/date';
import type { FormaPagamento } from '../types';
import StepIndicator from '../components/ui/StepIndicator';
import Button from '../components/ui/Button';
import ServiceCard from '../components/ui/ServiceCard';
import EmptyState from '../components/ui/EmptyState';

const ETAPAS = ['Serviço', 'Data', 'Horário', 'Resumo', 'Pagamento'];

const FORMAS: { id: FormaPagamento; label: string; icone: typeof CreditCard; descricao: string }[] = [
  { id: 'pix', label: 'PIX', icone: QrCode, descricao: 'Aprovação instantânea' },
  { id: 'credito', label: 'Cartão de crédito', icone: CreditCard, descricao: 'Em até 3x sem juros' },
  { id: 'debito', label: 'Cartão de débito', icone: Banknote, descricao: 'Débito à vista' },
];

export default function BookingFlow() {
  const { servicoId } = useParams();
  const navigate = useNavigate();
  const { agendamentos, criarAgendamento, notificar, servicosPro, getConfiguracaoAgenda } = useApp();

  const servicoInicial = servicoId ? servicosPro.find((s) => s.id === servicoId) : undefined;
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState(servicoInicial?.id ?? '');
  const [etapa, setEtapa] = useState(0);
  const [dataEscolhida, setDataEscolhida] = useState<string | null>(null);
  const [horaEscolhida, setHoraEscolhida] = useState<string | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix');
  const [processando, setProcessando] = useState(false);

  const servico = servicosPro.find((s) => s.id === servicoSelecionadoId);
  const profissional = servico ? getProfissional(servico.profissionalId) : undefined;
  const outrosServicos = profissional ? servicosPro.filter((s) => s.profissionalId === profissional.id) : [];

  const proximosDias = useMemo(() => gerarProximosDias(21), []);

  const horariosDisponiveis = useMemo(() => {
    if (!profissional || !servico || !dataEscolhida) return [];
    return gerarHorariosDisponiveis(
      profissional.id,
      getConfiguracaoAgenda(profissional.id),
      dataEscolhida,
      servico.duracaoMin,
      agendamentos,
    );
  }, [profissional, servico, dataEscolhida, agendamentos, getConfiguracaoAgenda]);

  if (!servico || !profissional) {
    return (
      <div className="px-5 pt-10">
        <EmptyState icone={Calendar} titulo="Serviço não encontrado" />
      </div>
    );
  }

  const taxa = Math.round(servico.preco * 0.03 * 100) / 100;
  const total = Math.round((servico.preco + taxa) * 100) / 100;

  function voltar() {
    if (etapa === 0) navigate(-1);
    else setEtapa((e) => e - 1);
  }

  function avancar() {
    setEtapa((e) => Math.min(e + 1, ETAPAS.length - 1));
  }

  function confirmarPagamento() {
    if (!dataEscolhida || !horaEscolhida || !servico || !profissional) return;
    const profissionalId = profissional.id;
    const servicoId = servico.id;
    const precoServico = servico.preco;
    const duracaoMin = servico.duracaoMin;
    setProcessando(true);
    setTimeout(() => {
      const novo = criarAgendamento({
        profissionalId,
        servicoId,
        data: dataEscolhida,
        horaInicio: horaEscolhida,
        horaFim: calcularHoraFim(horaEscolhida, duracaoMin),
        valorServico: precoServico,
        formaPagamento,
      });
      setProcessando(false);
      notificar('Agendamento confirmado! 💕');
      navigate(`/confirmacao/${novo.id}`, { replace: true });
    }, 1100);
  }

  return (
    <div className="fade-in flex min-h-svh flex-col pb-6">
      <header className="flex items-center gap-3 px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <button
          onClick={voltar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-soft"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-ink/45">{profissional.nome}</p>
          <h1 className="truncate font-display text-lg font-semibold">{ETAPAS[etapa]}</h1>
        </div>
      </header>

      <div className="px-5 py-2">
        <StepIndicator etapaAtual={etapa} total={ETAPAS.length} />
      </div>

      <div className="flex-1 px-5 pt-3">
        {etapa === 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink/50">Escolha o serviço com {profissional.nome}</p>
            {outrosServicos.map((s) => (
              <ServiceCard
                key={s.id}
                servico={s}
                selecionado={s.id === servicoSelecionadoId}
                onClick={() => setServicoSelecionadoId(s.id)}
              />
            ))}
          </div>
        )}

        {etapa === 1 && (
          <div>
            <p className="mb-3 text-sm text-ink/50">Escolha o melhor dia para você</p>
            <div className="grid grid-cols-4 gap-2.5">
              {proximosDias.map((dia) => (
                <button
                  key={dia}
                  onClick={() => setDataEscolhida(dia)}
                  className={`flex flex-col items-center gap-0.5 rounded-2xl py-3 transition-all ${
                    dataEscolhida === dia
                      ? 'bg-blush-700 text-white shadow-soft'
                      : 'bg-white text-ink/70 shadow-soft active:scale-95'
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-70">{diaSemanaAbrev(dia)}</span>
                  <span className="text-base font-bold">{diaNumero(dia)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {etapa === 2 && dataEscolhida && (
          <div>
            <p className="mb-3 text-sm text-ink/50">{formatarDataLabel(dataEscolhida)}</p>
            {horariosDisponiveis.length === 0 ? (
              <EmptyState
                icone={Calendar}
                titulo="Sem horários disponíveis"
                descricao="Escolha outra data para ver os horários livres."
              />
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {horariosDisponiveis.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoraEscolhida(h)}
                    className={`rounded-2xl py-3 text-sm font-semibold transition-all ${
                      horaEscolhida === h
                        ? 'bg-blush-700 text-white shadow-soft'
                        : 'bg-white text-ink/70 shadow-soft active:scale-95'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {etapa === 3 && dataEscolhida && horaEscolhida && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white p-5 shadow-soft">
              <div className="flex items-center gap-3 border-b border-blush-50 pb-4">
                <img src={profissional.fotoPerfil} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold leading-tight">{profissional.nome}</p>
                  <p className="text-xs text-ink/45">{profissional.bairro}</p>
                </div>
              </div>
              <dl className="mt-4 flex flex-col gap-2.5 text-sm">
                <Linha label="Serviço" valor={servico.nome} />
                <Linha label="Data" valor={formatarDataLabel(dataEscolhida)} />
                <Linha label="Dia da semana" valor={diaSemanaAbrev(dataEscolhida)} />
                <Linha label="Horário" valor={`${horaEscolhida} – ${calcularHoraFim(horaEscolhida, servico.duracaoMin)}`} />
                <Linha label="Duração" valor={formatarDuracao(servico.duracaoMin)} />
              </dl>
              <div className="mt-4 gold-divider" />
              <dl className="mt-4 flex flex-col gap-2 text-sm">
                <Linha label="Valor do serviço" valor={formatarMoeda(servico.preco)} />
                <Linha label="Taxa de serviço" valor={formatarMoeda(taxa)} />
                <div className="mt-1 flex items-center justify-between text-base font-bold text-blush-800">
                  <span>Total</span>
                  <span>{formatarMoeda(total)}</span>
                </div>
              </dl>
            </div>
          </div>
        )}

        {etapa === 4 && (
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-sm text-ink/50">Como você prefere pagar?</p>
            {FORMAS.map(({ id, label, icone: Icone, descricao }) => (
              <button
                key={id}
                onClick={() => setFormaPagamento(id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  formaPagamento === id ? 'border-blush-500 bg-blush-50' : 'border-transparent bg-white shadow-soft'
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-700">
                  <Icone size={18} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-ink/45">{descricao}</span>
                </span>
                <span
                  className={`h-5 w-5 rounded-full border-2 ${
                    formaPagamento === id ? 'border-blush-600 bg-blush-600' : 'border-blush-200'
                  }`}
                />
              </button>
            ))}

            <div className="mt-2 rounded-2xl bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between text-sm text-ink/60">
                <span>Total a pagar</span>
                <span className="text-lg font-bold text-blush-800">{formatarMoeda(total)}</span>
              </div>
            </div>
            <p className="px-1 text-center text-[11px] leading-relaxed text-ink/35">
              Pagamento processado com segurança. Não armazenamos os dados do seu cartão.
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 mt-4 bg-cream px-5 pb-2 pt-2">
        <Button
          fullWidth
          loading={processando}
          disabled={
            (etapa === 0 && !servicoSelecionadoId) ||
            (etapa === 1 && !dataEscolhida) ||
            (etapa === 2 && !horaEscolhida)
          }
          onClick={etapa === 4 ? confirmarPagamento : avancar}
        >
          {etapa === 4 ? `Confirmar e pagar ${formatarMoeda(total)}` : 'Continuar'}
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
