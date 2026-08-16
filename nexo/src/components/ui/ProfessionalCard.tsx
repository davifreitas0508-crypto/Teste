import { Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Profissional } from '../../types';
import { useApp } from '../../context/AppContext';
import { getCategoria } from '../../data/mockData';
import RatingStars from './RatingStars';

export default function ProfessionalCard({
  profissional,
  variante = 'padrao',
}: {
  profissional: Profissional;
  variante?: 'padrao' | 'compacto';
}) {
  const navigate = useNavigate();
  const { cliente, alternarFavorito } = useApp();
  const favorito = cliente.favoritos.includes(profissional.id);

  function abrirPerfil() {
    navigate(`/profissional/${profissional.id}`);
  }

  function aoTeclar(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirPerfil();
    }
  }

  if (variante === 'compacto') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={abrirPerfil}
        onKeyDown={aoTeclar}
        className="flex w-40 shrink-0 cursor-pointer flex-col overflow-hidden rounded-3xl bg-white text-left shadow-soft transition-transform active:scale-[0.98]"
      >
        <div className="relative h-28 w-full overflow-hidden">
          <img src={profissional.fotoCapa} alt="" className="h-full w-full object-cover" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              alternarFavorito(profissional.id);
            }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
          >
            <Heart size={14} className={favorito ? 'fill-blush-600 text-blush-600' : 'text-ink/40'} />
          </button>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <p className="truncate text-sm font-semibold leading-tight">{profissional.nome}</p>
          <RatingStars nota={profissional.avaliacaoMedia} tamanho={11} />
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={abrirPerfil}
      onKeyDown={aoTeclar}
      className="flex w-full cursor-pointer items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-soft transition-transform active:scale-[0.98]"
    >
      <img
        src={profissional.fotoPerfil}
        alt=""
        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold leading-tight">{profissional.nome}</p>
        <p className="mt-0.5 truncate text-xs text-ink/50">
          {profissional.categorias.map((c) => getCategoria(c)?.nome).join(' · ')}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <RatingStars nota={profissional.avaliacaoMedia} tamanho={12} />
          <span className="flex items-center gap-0.5 text-xs text-ink/40">
            <MapPin size={11} /> {profissional.distanciaKm} km
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          alternarFavorito(profissional.id);
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-50"
      >
        <Heart size={15} className={favorito ? 'fill-blush-600 text-blush-600' : 'text-ink/30'} />
      </button>
    </div>
  );
}
