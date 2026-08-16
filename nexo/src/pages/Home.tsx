import { ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  categorias,
  getProfissional,
  getServico,
  profissionais,
  promocoes,
} from '../data/mockData';
import CategoryPill from '../components/ui/CategoryPill';
import ProfessionalCard from '../components/ui/ProfessionalCard';
import SearchBar from '../components/ui/SearchBar';
import { diaNumero, diaSemanaAbrev, formatarDataLabel } from '../utils/date';

export default function Home() {
  const navigate = useNavigate();
  const { cliente, agendamentos } = useApp();

  const proximosAgendamentos = agendamentos
    .filter((a) => a.clienteId === 'cliente-1' && a.status === 'confirmado')
    .sort((a, b) => (a.data + a.horaInicio).localeCompare(b.data + b.horaInicio))
    .slice(0, 2);

  const emDestaque = profissionais.filter((p) => p.emDestaque);
  const melhorAvaliados = [...profissionais]
    .sort((a, b) => b.avaliacaoMedia - a.avaliacaoMedia)
    .slice(0, 4);

  return (
    <div className="fade-in pb-6">
      <header className="rounded-b-[2rem] bg-gradient-to-b from-blush-100 to-cream px-5 pb-6 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={18} className="text-gold-500" />
            <span className="font-display text-lg font-semibold tracking-wide text-blush-800">Belle</span>
          </div>
          <button
            onClick={() => navigate('/perfil')}
            className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-soft"
          >
            <img src={cliente.foto} alt={cliente.nome} className="h-full w-full object-cover" />
          </button>
        </div>

        <h1 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink">
          Olá, {cliente.nome.split(' ')[0]}, linda! 💕
        </h1>
        <p className="mt-0.5 text-sm text-ink/55">O que vamos agendar hoje?</p>

        <div className="mt-4">
          <SearchBar
            valor=""
            onChange={() => {}}
            onFocus={() => navigate('/explorar')}
            readOnly
            onFiltro={() => navigate('/explorar')}
          />
        </div>
      </header>

      <section className="mt-5 px-5">
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {categorias.map((c) => (
            <CategoryPill key={c.id} categoria={c} onClick={() => navigate(`/explorar?categoria=${c.id}`)} />
          ))}
        </div>
      </section>

      {proximosAgendamentos.length > 0 && (
        <section className="mt-6 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Agendamentos próximos</h2>
            <button
              onClick={() => navigate('/agendamentos')}
              className="flex items-center text-xs font-medium text-blush-700"
            >
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
            {proximosAgendamentos.map((ag) => {
              const prof = getProfissional(ag.profissionalId);
              const serv = getServico(ag.servicoId);
              if (!prof || !serv) return null;
              return (
                <button
                  key={ag.id}
                  onClick={() => navigate('/agendamentos')}
                  className="flex w-64 shrink-0 items-center gap-3 rounded-3xl bg-gradient-to-br from-blush-700 to-blush-800 p-4 text-left text-white shadow-soft-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/15">
                    <span className="text-[10px] uppercase leading-none opacity-80">{diaSemanaAbrev(ag.data)}</span>
                    <span className="text-lg font-bold leading-none">{diaNumero(ag.data)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{serv.nome}</p>
                    <p className="truncate text-xs text-white/70">{prof.nome}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/90">{ag.horaInicio} · {formatarDataLabel(ag.data)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-6 px-5">
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {promocoes.map((promo) => (
            <div
              key={promo.id}
              className={`flex w-72 shrink-0 flex-col justify-between rounded-3xl bg-gradient-to-br ${promo.corFundo} p-5 shadow-soft`}
            >
              <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-blush-800">
                {promo.desconto} OFF
              </span>
              <div className="mt-4">
                <p className="font-display text-base font-semibold text-ink">{promo.titulo}</p>
                <p className="mt-0.5 text-xs text-ink/60">{promo.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Profissionais em destaque</h2>
        </div>
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {emDestaque.map((p) => (
            <ProfessionalCard key={p.id} profissional={p} variante="compacto" />
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Mais bem avaliados</h2>
          <button
            onClick={() => navigate('/explorar')}
            className="flex items-center text-xs font-medium text-blush-700"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {melhorAvaliados.map((p) => (
            <ProfessionalCard key={p.id} profissional={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
