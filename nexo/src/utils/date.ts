const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const DIAS_SEMANA_LONGO = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function hojeISO(): string {
  return toISODate(new Date());
}

export function formatarDataCurta(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]}`;
}

export function formatarDataLabel(iso: string): string {
  const hoje = hojeISO();
  const amanha = toISODate(new Date(Date.now() + 86400000));
  if (iso === hoje) return `Hoje, ${formatarDataCurta(iso)}`;
  if (iso === amanha) return `Amanhã, ${formatarDataCurta(iso)}`;
  const d = parseISODate(iso);
  return `${DIAS_SEMANA_LONGO[d.getDay()]}, ${formatarDataCurta(iso)}`;
}

export function diaSemanaAbrev(iso: string): string {
  return DIAS_SEMANA[parseISODate(iso).getDay()];
}

export function diaNumero(iso: string): number {
  return parseISODate(iso).getDate();
}

export function gerarProximosDias(quantidade: number): string[] {
  const dias: string[] = [];
  for (let i = 0; i < quantidade; i++) {
    dias.push(toISODate(new Date(Date.now() + i * 86400000)));
  }
  return dias;
}

export function minutosParaHora(minutos: number): string {
  const h = Math.floor(minutos / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutos % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function horaParaMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

export function somarMinutos(hora: string, minutos: number): string {
  const [h, m] = hora.split(':').map(Number);
  return minutosParaHora(h * 60 + m + minutos);
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarDuracao(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const resto = min % 60;
  return resto === 0 ? `${h}h` : `${h}h${resto}min`;
}
