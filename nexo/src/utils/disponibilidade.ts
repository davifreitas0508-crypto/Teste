import type { Agendamento, ConfiguracaoAgenda } from '../types';
import { horaParaMinutos, minutosParaHora, parseISODate, somarMinutos } from './date';

export function gerarHorariosDisponiveis(
  profissionalId: string,
  cfg: ConfiguracaoAgenda,
  data: string,
  duracaoServicoMin: number,
  agendamentosExistentes: Agendamento[],
): string[] {
  const diaSemana = parseISODate(data).getDay();
  const faixa = cfg.disponibilidade[diaSemana];

  if (!faixa) return [];
  if (cfg.diasFolga.includes(data)) return [];
  if (cfg.feriados.includes(data)) return [];

  const inicioMin = horaParaMinutos(faixa.inicio);
  const fimMin = horaParaMinutos(faixa.fim);
  const passo = 30; // granularidade dos horários exibidos

  const bloqueiosDoDia = [
    ...(cfg.intervaloAlmoco
      ? [{ inicio: horaParaMinutos(cfg.intervaloAlmoco.inicio), fim: horaParaMinutos(cfg.intervaloAlmoco.fim) }]
      : []),
    ...cfg.bloqueiosManuais
      .filter((b) => b.data === data)
      .map((b) => ({ inicio: horaParaMinutos(b.inicio), fim: horaParaMinutos(b.fim) })),
  ];

  const ocupados = agendamentosExistentes
    .filter(
      (a) =>
        a.profissionalId === profissionalId &&
        a.data === data &&
        a.status !== 'cancelado',
    )
    .map((a) => ({
      inicio: horaParaMinutos(a.horaInicio),
      fim: horaParaMinutos(a.horaFim) + cfg.intervaloEntreAtendimentosMin,
    }));

  const todosBloqueios = [...bloqueiosDoDia, ...ocupados];
  const agora = new Date();
  const isHoje = data === agora.toISOString().slice(0, 10);
  const minutoAtual = agora.getHours() * 60 + agora.getMinutes();

  const horarios: string[] = [];
  for (let inicio = inicioMin; inicio + duracaoServicoMin <= fimMin; inicio += passo) {
    const fimAtendimento = inicio + duracaoServicoMin;
    if (isHoje && inicio <= minutoAtual) continue;

    const conflita = todosBloqueios.some(
      (b) => inicio < b.fim && fimAtendimento > b.inicio,
    );
    if (!conflita) {
      horarios.push(minutosParaHora(inicio));
    }
  }
  return horarios;
}

export function calcularHoraFim(horaInicio: string, duracaoMin: number): string {
  return somarMinutos(horaInicio, duracaoMin);
}
