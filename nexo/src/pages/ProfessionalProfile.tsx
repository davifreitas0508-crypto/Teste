import { ArrowLeft, Clock, Heart, MapPin, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvaliacoesDoProfissional, getProfissional } from '../data/mockData';
import ServiceCard from '../components/ui/ServiceCard';
import RatingStars from '../components/ui/RatingStars';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cliente, alternarFavorito, servicosPro } = useApp();
  const [aba, setAba] = useState<'servicos' | 'portfolio' | 'avaliacoes'>('servicos');

  const profissional = id ? getProfissional(id) : undefined;
  const servicosDoProf = useMemo(
    () => servicosPro.filter((s) => s.profissionalId === id),
    [id, servicosPro],
  );
  const avaliacoesDoProf = useMemo(() => (id ? getAvaliacoesDoProfissional(id) : []), [id]);

  if (!profissional) {
    return (
      <EmptyState icone={MapPin} titulo="Profissional não encontrado" />
    );
  }

  const favorito = cliente.favoritos.includes(profissional.id);

  return (
    <div className="fade-in pb-28">
      <div className="relative h-56 w-full">
        <img src={profissional.fotoCapa} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft"
        >
          <ArrowLeft size={17} />
        </button>
        <button
          onClick={() => alternarFavorito(profissional.id)}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft"
        >
          <Heart size={16} className={favorito ? 'fill-blush-600 text-blush-600' : ''} />
        </button>
        <img
          src={profissional.fotoPerfil}
          alt=""
          className="absolute -bottom-9 left-5 h-20 w-20 rounded-2xl border-4 border-cream object-cover shadow-soft-lg"
        />
      </div>

      <div className="mt-12 px-5">
        <h1 className="font-display text-xl font-semibold leading-tight">{profissional.nome}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <RatingStars nota={profissional.avaliacaoMedia} />
          <span className="text-ink/40">({profissional.totalAvaliacoes} avaliações)</span>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-ink/55">
          <MapPin size={14} className="mt-0.5 shrink-0 text-blush-500" />
          {profissional.endereco}, {profissional.bairro} · {profissional.distanciaKm} km
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{profissional.descricao}</p>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-soft">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blush-700">
            <Clock size={13} /> Horário de funcionamento
          </p>
          <div className="grid grid-cols-1 gap-1 text-xs text-ink/60">
            {DIAS.map((dia, i) => {
              const faixa = profissional.configuracaoAgenda.disponibilidade[i];
              return (
                <div key={dia} className="flex justify-between">
                  <span>{dia}</span>
                  <span className={faixa ? 'font-medium text-ink/80' : 'text-ink/35'}>
                    {faixa ? `${faixa.inicio} – ${faixa.fim}` : 'Fechado'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b border-blush-100">
          {(
            [
              ['servicos', 'Serviços'],
              ['portfolio', 'Portfólio'],
              ['avaliacoes', 'Avaliações'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`px-3 pb-3 text-sm font-medium transition-colors ${
                aba === id ? 'border-b-2 border-blush-700 text-blush-800' : 'text-ink/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {aba === 'servicos' && (
          <div className="mt-4 flex flex-col gap-3">
            {servicosDoProf.map((s) => (
              <ServiceCard key={s.id} servico={s} onClick={() => navigate(`/agendar/${s.id}`)} />
            ))}
          </div>
        )}

        {aba === 'portfolio' && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {profissional.portfolio.map((foto, i) => (
              <img key={i} src={foto} alt="" className="aspect-square w-full rounded-2xl object-cover" />
            ))}
          </div>
        )}

        {aba === 'avaliacoes' && (
          <div className="mt-4 flex flex-col gap-3">
            {avaliacoesDoProf.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink/40">Ainda não há avaliações.</p>
            ) : (
              avaliacoesDoProf.map((av) => (
                <div key={av.id} className="rounded-2xl bg-white p-4 shadow-soft">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < av.nota ? 'fill-gold-500 text-gold-500' : 'text-blush-200'}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{av.comentario}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-blush-100 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
        <Button
          fullWidth
          onClick={() => navigate(`/agendar/${servicosDoProf[0]?.id ?? ''}`)}
          disabled={servicosDoProf.length === 0}
        >
          Agendar horário
        </Button>
      </div>
    </div>
  );
}
