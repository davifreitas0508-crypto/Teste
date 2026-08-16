import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profissionais } from '../data/mockData';
import ProfessionalCard from '../components/ui/ProfessionalCard';
import EmptyState from '../components/ui/EmptyState';

export default function Favorites() {
  const { cliente } = useApp();
  const favoritos = profissionais.filter((p) => cliente.favoritos.includes(p.id));

  return (
    <div className="fade-in pb-8">
      <header className="px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-xl font-semibold">Favoritos</h1>
        <p className="text-sm text-ink/50">Seus profissionais salvos</p>
      </header>

      <section className="mt-3 flex flex-col gap-3 px-5">
        {favoritos.length === 0 ? (
          <EmptyState
            icone={Heart}
            titulo="Nenhum favorito ainda"
            descricao="Toque no coração de um profissional para salvá-lo aqui."
          />
        ) : (
          favoritos.map((p) => <ProfessionalCard key={p.id} profissional={p} />)
        )}
      </section>
    </div>
  );
}
