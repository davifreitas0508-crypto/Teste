import { useState } from 'react';
import { Ban, CalendarOff, Clock, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatarDataLabel } from '../../utils/date';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function ProSettings() {
  const { sessao, getConfiguracaoAgenda, atualizarConfiguracaoAgenda, notificar } = useApp();
  const profissionalId = sessao?.tipo === 'profissional' ? sessao.profissionalId : '';
  const cfg = getConfiguracaoAgenda(profissionalId);

  const [novaFolga, setNovaFolga] = useState('');
  const [bloqueio, setBloqueio] = useState({ data: '', inicio: '09:00', fim: '10:00', motivo: '' });

  function alternarDia(dia: number, ativo: boolean) {
    const disponibilidade = { ...cfg.disponibilidade };
    disponibilidade[dia] = ativo ? { inicio: '09:00', fim: '18:00' } : null;
    atualizarConfiguracaoAgenda(profissionalId, { disponibilidade });
  }

  function alterarHorarioDia(dia: number, campo: 'inicio' | 'fim', valor: string) {
    const faixaAtual = cfg.disponibilidade[dia];
    if (!faixaAtual) return;
    const disponibilidade = { ...cfg.disponibilidade, [dia]: { ...faixaAtual, [campo]: valor } };
    atualizarConfiguracaoAgenda(profissionalId, { disponibilidade });
  }

  return (
    <div className="fade-in pb-8">
      <header className="px-5 pb-3 pt-4">
        <h1 className="font-display text-xl font-semibold">Configurações da agenda</h1>
        <p className="text-sm text-ink/50">Defina seus dias e horários de atendimento</p>
      </header>

      <section className="mt-2 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Dias de atendimento</p>
        <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-soft">
          {DIAS.map((dia, i) => {
            const faixa = cfg.disponibilidade[i];
            return (
              <div key={dia} className="flex items-center justify-between gap-2 border-b border-blush-50 py-2.5 last:border-0">
                <span className="w-20 shrink-0 text-sm text-ink/70">{dia}</span>
                {faixa ? (
                  <div className="flex flex-1 items-center justify-end gap-1.5">
                    <input
                      type="time"
                      value={faixa.inicio}
                      onChange={(e) => alterarHorarioDia(i, 'inicio', e.target.value)}
                      className="rounded-lg bg-blush-50 px-2 py-1 text-xs outline-none"
                    />
                    <span className="text-xs text-ink/30">até</span>
                    <input
                      type="time"
                      value={faixa.fim}
                      onChange={(e) => alterarHorarioDia(i, 'fim', e.target.value)}
                      className="rounded-lg bg-blush-50 px-2 py-1 text-xs outline-none"
                    />
                  </div>
                ) : (
                  <span className="flex-1 text-right text-xs text-ink/35">Fechado</span>
                )}
                <Interruptor checked={!!faixa} onChange={(v) => alternarDia(i, v)} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Intervalo para almoço</p>
        <div className="flex items-center justify-between gap-2 rounded-3xl bg-white p-4 shadow-soft">
          <Interruptor
            checked={!!cfg.intervaloAlmoco}
            onChange={(v) =>
              atualizarConfiguracaoAgenda(profissionalId, {
                intervaloAlmoco: v ? { inicio: '12:00', fim: '13:00' } : null,
              })
            }
          />
          {cfg.intervaloAlmoco && (
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={cfg.intervaloAlmoco.inicio}
                onChange={(e) =>
                  atualizarConfiguracaoAgenda(profissionalId, {
                    intervaloAlmoco: { ...cfg.intervaloAlmoco!, inicio: e.target.value },
                  })
                }
                className="rounded-lg bg-blush-50 px-2 py-1 text-xs outline-none"
              />
              <span className="text-xs text-ink/30">até</span>
              <input
                type="time"
                value={cfg.intervaloAlmoco.fim}
                onChange={(e) =>
                  atualizarConfiguracaoAgenda(profissionalId, {
                    intervaloAlmoco: { ...cfg.intervaloAlmoco!, fim: e.target.value },
                  })
                }
                className="rounded-lg bg-blush-50 px-2 py-1 text-xs outline-none"
              />
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
          Intervalo entre atendimentos
        </p>
        <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-soft">
          <span className="flex items-center gap-2 text-sm text-ink/70">
            <Clock size={15} className="text-blush-500" /> Tempo de preparo entre clientes
          </span>
          <select
            value={cfg.intervaloEntreAtendimentosMin}
            onChange={(e) =>
              atualizarConfiguracaoAgenda(profissionalId, {
                intervaloEntreAtendimentosMin: Number(e.target.value),
              })
            }
            className="rounded-xl bg-blush-50 px-3 py-1.5 text-sm outline-none"
          >
            {[0, 10, 15, 20, 30].map((min) => (
              <option key={min} value={min}>
                {min} min
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Dias de folga</p>
        <div className="rounded-3xl bg-white p-4 shadow-soft">
          <div className="flex gap-2">
            <input
              type="date"
              value={novaFolga}
              onChange={(e) => setNovaFolga(e.target.value)}
              className="flex-1 rounded-xl bg-blush-50 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={() => {
                if (!novaFolga || cfg.diasFolga.includes(novaFolga)) return;
                atualizarConfiguracaoAgenda(profissionalId, { diasFolga: [...cfg.diasFolga, novaFolga] });
                notificar('Dia de folga adicionado.');
                setNovaFolga('');
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush-700 text-white"
            >
              <Plus size={16} />
            </button>
          </div>
          {cfg.diasFolga.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {cfg.diasFolga.map((d) => (
                <div key={d} className="flex items-center justify-between rounded-xl bg-blush-50 px-3 py-2 text-xs">
                  <span className="flex items-center gap-1.5 text-ink/70">
                    <CalendarOff size={13} className="text-blush-500" /> {formatarDataLabel(d)}
                  </span>
                  <button
                    onClick={() =>
                      atualizarConfiguracaoAgenda(profissionalId, {
                        diasFolga: cfg.diasFolga.filter((x) => x !== d),
                      })
                    }
                    className="text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Bloqueio manual de horários</p>
        <div className="rounded-3xl bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-2">
            <input
              type="date"
              value={bloqueio.data}
              onChange={(e) => setBloqueio({ ...bloqueio, data: e.target.value })}
              className="rounded-xl bg-blush-50 px-3 py-2 text-sm outline-none"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={bloqueio.inicio}
                onChange={(e) => setBloqueio({ ...bloqueio, inicio: e.target.value })}
                className="flex-1 rounded-xl bg-blush-50 px-3 py-2 text-sm outline-none"
              />
              <input
                type="time"
                value={bloqueio.fim}
                onChange={(e) => setBloqueio({ ...bloqueio, fim: e.target.value })}
                className="flex-1 rounded-xl bg-blush-50 px-3 py-2 text-sm outline-none"
              />
            </div>
            <input
              value={bloqueio.motivo}
              onChange={(e) => setBloqueio({ ...bloqueio, motivo: e.target.value })}
              placeholder="Motivo (opcional)"
              className="rounded-xl bg-blush-50 px-3 py-2 text-sm outline-none placeholder:text-ink/35"
            />
            <button
              onClick={() => {
                if (!bloqueio.data) return;
                atualizarConfiguracaoAgenda(profissionalId, {
                  bloqueiosManuais: [...cfg.bloqueiosManuais, bloqueio],
                });
                notificar('Horário bloqueado.');
                setBloqueio({ data: '', inicio: '09:00', fim: '10:00', motivo: '' });
              }}
              className="mt-1 rounded-xl bg-blush-700 py-2.5 text-sm font-semibold text-white"
            >
              Adicionar bloqueio
            </button>
          </div>

          {cfg.bloqueiosManuais.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {cfg.bloqueiosManuais.map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-blush-50 px-3 py-2 text-xs">
                  <span className="flex items-center gap-1.5 text-ink/70">
                    <Ban size={13} className="text-blush-500" />
                    {formatarDataLabel(b.data)} · {b.inicio}–{b.fim} {b.motivo && `· ${b.motivo}`}
                  </span>
                  <button
                    onClick={() =>
                      atualizarConfiguracaoAgenda(profissionalId, {
                        bloqueiosManuais: cfg.bloqueiosManuais.filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Interruptor({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-blush-700' : 'bg-blush-100'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
