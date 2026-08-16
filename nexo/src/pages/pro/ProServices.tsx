import { useState } from 'react';
import { Pencil, Plus, Scissors, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categorias } from '../../data/mockData';
import { formatarDuracao, formatarMoeda } from '../../utils/date';
import type { CategoriaId, Servico } from '../../types';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const FOTO_PADRAO =
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop';

export default function ProServices() {
  const { sessao, servicosPro, criarServico, atualizarServico, removerServico, notificar } = useApp();
  const profissionalId = sessao?.tipo === 'profissional' ? sessao.profissionalId : '';
  const meusServicos = servicosPro.filter((s) => s.profissionalId === profissionalId);

  const [editando, setEditando] = useState<Servico | null>(null);
  const [criando, setCriando] = useState(false);
  const [excluir, setExcluir] = useState<Servico | null>(null);

  return (
    <div className="fade-in pb-8">
      <header className="flex items-center justify-between px-5 pb-3 pt-4">
        <div>
          <h1 className="font-display text-xl font-semibold">Serviços</h1>
          <p className="text-sm text-ink/50">{meusServicos.length} cadastrados</p>
        </div>
        <button
          onClick={() => setCriando(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-700 text-white shadow-soft"
        >
          <Plus size={18} />
        </button>
      </header>

      <section className="flex flex-col gap-3 px-5">
        {meusServicos.length === 0 ? (
          <EmptyState icone={Scissors} titulo="Nenhum serviço cadastrado" descricao="Toque no + para adicionar seu primeiro serviço." />
        ) : (
          meusServicos.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-soft">
              <img src={s.foto} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold leading-tight">{s.nome}</p>
                <p className="text-xs text-ink/45">{categorias.find((c) => c.id === s.categoriaId)?.nome}</p>
                <p className="mt-1 text-xs font-medium text-blush-700">
                  {formatarMoeda(s.preco)} · {formatarDuracao(s.duracaoMin)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  onClick={() => setEditando(s)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-50 text-blush-700"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setExcluir(s)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <ServiceFormSheet
        aberto={criando}
        onFechar={() => setCriando(false)}
        titulo="Novo serviço"
        onSalvar={(dados) => {
          criarServico({ ...dados, profissionalId });
          notificar('Serviço cadastrado com sucesso!');
          setCriando(false);
        }}
      />

      <ServiceFormSheet
        aberto={!!editando}
        onFechar={() => setEditando(null)}
        titulo="Editar serviço"
        inicial={editando ?? undefined}
        onSalvar={(dados) => {
          if (!editando) return;
          atualizarServico(editando.id, dados);
          notificar('Serviço atualizado!');
          setEditando(null);
        }}
      />

      <Sheet aberto={!!excluir} onFechar={() => setExcluir(null)} titulo="Remover serviço">
        {excluir && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink/60">Tem certeza que deseja remover "{excluir.nome}"?</p>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setExcluir(null)}>
                Voltar
              </Button>
              <Button
                fullWidth
                className="!bg-red-500 hover:!bg-red-600"
                onClick={() => {
                  removerServico(excluir.id);
                  notificar('Serviço removido.', 'info');
                  setExcluir(null);
                }}
              >
                Remover
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function ServiceFormSheet({
  aberto,
  onFechar,
  titulo,
  inicial,
  onSalvar,
}: {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  inicial?: Servico;
  onSalvar: (dados: Omit<Servico, 'id' | 'profissionalId'>) => void;
}) {
  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [categoriaId, setCategoriaId] = useState<CategoriaId>(inicial?.categoriaId ?? 'unhas');
  const [descricao, setDescricao] = useState(inicial?.descricao ?? '');
  const [preco, setPreco] = useState(String(inicial?.preco ?? ''));
  const [duracaoMin, setDuracaoMin] = useState(String(inicial?.duracaoMin ?? ''));

  return (
    <Sheet
      aberto={aberto}
      onFechar={() => {
        onFechar();
      }}
      titulo={titulo}
    >
      <div className="flex flex-col gap-3">
        <Campo label="Nome do serviço" valor={nome} onChange={setNome} placeholder="Ex: Escova Modelada" />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink/50">Categoria</span>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value as CategoriaId)}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm shadow-soft outline-none"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink/50">Descrição</span>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm shadow-soft outline-none"
          />
        </label>
        <div className="flex gap-3">
          <Campo label="Preço (R$)" valor={preco} onChange={setPreco} tipo="number" />
          <Campo label="Duração (min)" valor={duracaoMin} onChange={setDuracaoMin} tipo="number" />
        </div>
        <Button
          fullWidth
          className="mt-2"
          disabled={!nome || !preco || !duracaoMin}
          onClick={() =>
            onSalvar({
              nome,
              categoriaId,
              descricao,
              preco: Number(preco),
              duracaoMin: Number(duracaoMin),
              foto: inicial?.foto ?? FOTO_PADRAO,
            })
          }
        >
          Salvar serviço
        </Button>
      </div>
    </Sheet>
  );
}

function Campo({
  label,
  valor,
  onChange,
  placeholder,
  tipo = 'text',
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  tipo?: string;
}) {
  return (
    <label className="block flex-1">
      <span className="mb-1.5 block text-xs font-medium text-ink/50">{label}</span>
      <input
        value={valor}
        type={tipo}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white px-4 py-3 text-sm shadow-soft outline-none"
      />
    </label>
  );
}
