import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, MapPin } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import CategoryPill from '../components/ui/CategoryPill';
import ProfessionalCard from '../components/ui/ProfessionalCard';
import EmptyState from '../components/ui/EmptyState';
import { categorias, profissionais, servicos } from '../data/mockData';
import type { CategoriaId } from '../types';

type Ordenacao = 'avaliacao' | 'distancia' | 'preco';

const OPCOES_ORDENACAO: { id: Ordenacao; label: string }[] = [
  { id: 'avaliacao', label: 'Melhor avaliação' },
  { id: 'distancia', label: 'Mais perto' },
  { id: 'preco', label: 'Menor preço' },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const categoriaAtiva = params.get('categoria') as CategoriaId | null;
  const [busca, setBusca] = useState(params.get('q') ?? '');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('avaliacao');
  const [mostrarOrdenacao, setMostrarOrdenacao] = useState(false);

  function alternarCategoria(id: CategoriaId) {
    const novo = new URLSearchParams(params);
    if (categoriaAtiva === id) novo.delete('categoria');
    else novo.set('categoria', id);
    setParams(novo, { replace: true });
  }

  const precoMinimoPorProfissional = useMemo(() => {
    const mapa = new Map<string, number>();
    servicos.forEach((s) => {
      const atual = mapa.get(s.profissionalId);
      if (atual === undefined || s.preco < atual) mapa.set(s.profissionalId, s.preco);
    });
    return mapa;
  }, []);

  const resultado = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    let lista = profissionais.filter((p) => {
      if (categoriaAtiva && !p.categorias.includes(categoriaAtiva)) return false;
      if (!termo) return true;
      const servicosDoProf = servicos.filter((s) => s.profissionalId === p.id);
      return (
        p.nome.toLowerCase().includes(termo) ||
        p.bairro.toLowerCase().includes(termo) ||
        p.categorias.some((c) => categorias.find((cat) => cat.id === c)?.nome.toLowerCase().includes(termo)) ||
        servicosDoProf.some((s) => s.nome.toLowerCase().includes(termo))
      );
    });

    lista = [...lista].sort((a, b) => {
      if (ordenacao === 'avaliacao') return b.avaliacaoMedia - a.avaliacaoMedia;
      if (ordenacao === 'distancia') return a.distanciaKm - b.distanciaKm;
      const precoA = precoMinimoPorProfissional.get(a.id) ?? Infinity;
      const precoB = precoMinimoPorProfissional.get(b.id) ?? Infinity;
      return precoA - precoB;
    });

    return lista;
  }, [busca, categoriaAtiva, ordenacao, precoMinimoPorProfissional]);

  return (
    <div className="fade-in pb-8">
      <header className="px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-xl font-semibold">Explorar</h1>
        <p className="text-sm text-ink/50">Encontre a profissional ideal para você</p>
        <div className="mt-4">
          <SearchBar
            valor={busca}
            onChange={(v) => {
              setBusca(v);
              const novo = new URLSearchParams(params);
              if (v) novo.set('q', v);
              else novo.delete('q');
              setParams(novo, { replace: true });
            }}
            placeholder="Nome, serviço, categoria ou bairro"
          />
        </div>
      </header>

      <section className="px-5">
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {categorias.map((c) => (
            <CategoryPill
              key={c.id}
              categoria={c}
              ativo={categoriaAtiva === c.id}
              onClick={() => alternarCategoria(c.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-4 flex items-center justify-between px-5">
        <p className="text-xs text-ink/45">{resultado.length} encontrados</p>
        <div className="relative">
          <button
            onClick={() => setMostrarOrdenacao((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-blush-800 shadow-soft"
          >
            <ArrowUpDown size={13} />
            {OPCOES_ORDENACAO.find((o) => o.id === ordenacao)?.label}
          </button>
          {mostrarOrdenacao && (
            <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl bg-white py-1 shadow-soft-lg">
              {OPCOES_ORDENACAO.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setOrdenacao(o.id);
                    setMostrarOrdenacao(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-xs ${
                    ordenacao === o.id ? 'font-semibold text-blush-700' : 'text-ink/70'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-3 px-5">
        {resultado.length === 0 ? (
          <EmptyState
            icone={MapPin}
            titulo="Nada encontrado"
            descricao="Tente buscar por outro nome, serviço ou categoria."
          />
        ) : (
          resultado.map((p) => <ProfessionalCard key={p.id} profissional={p} />)
        )}
      </section>
    </div>
  );
}
