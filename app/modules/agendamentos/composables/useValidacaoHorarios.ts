/**
 * PROPÓSITO: Composable para validar conflitos de horário em agendamentos
 * IMPORTA: tipos de Agendamento
 * USADO_POR: NovoAgendamentoModal.vue e outros componentes que precisam validar horários
 */

import { computed } from 'vue'
import type { Agendamento } from '../types/agendamentos.types'

export const useValidacaoHorarios = () => {
  /**
   * Verifica se há conflito entre dois intervalos de horário
   * @param inicio1 - Hora de início do primeiro intervalo (HH:MM)
   * @param fim1 - Hora de fim do primeiro intervalo (HH:MM)
   * @param inicio2 - Hora de início do segundo intervalo (HH:MM)
   * @param fim2 - Hora de fim do segundo intervalo (HH:MM)
   * @returns true se há conflito, false caso contrário
   */
  const temConflitoHorario = (
    inicio1: string,
    fim1: string,
    inicio2: string,
    fim2: string
  ): boolean => {
    // Converter para minutos desde meia-noite para facilitar comparação
    const minutosInicio1 = horaParaMinutos(inicio1)
    const minutosFim1 = horaParaMinutos(fim1)
    const minutosInicio2 = horaParaMinutos(inicio2)
    const minutosFim2 = horaParaMinutos(fim2)

    // Verificar se os intervalos se sobrepõem
    return minutosInicio1 < minutosFim2 && minutosFim1 > minutosInicio2
  }

  /**
   * Converte uma string de horário (HH:MM) para minutos desde meia-noite
   * @param hora - String no formato HH:MM
   * @returns Número de minutos desde meia-noite
   */
  const horaParaMinutos = (hora: string): number => {
    const partes = hora.split(':')
    if (partes.length !== 2) return 0

    const horasStr = partes[0]
    const minutosStr = partes[1]

    if (!horasStr || !minutosStr) return 0

    const horas = parseInt(horasStr, 10)
    const minutos = parseInt(minutosStr, 10)

    if (isNaN(horas) || isNaN(minutos)) return 0

    return horas * 60 + minutos
  }

  /**
   * Verifica se um horário específico conflita com os agendamentos existentes
   * @param data - Data no formato YYYY-MM-DD
   * @param horaInicio - Hora de início (HH:MM)
   * @param horaFim - Hora de fim (HH:MM)
   * @param agendamentos - Lista de agendamentos existentes
   * @param excluirAgendamentoId - ID de agendamento para excluir da validação (útil para edição)
   * @returns true se há conflito, false caso contrário
   */
  const horarioConflitaComAgendamentos = (
    data: string,
    horaInicio: string,
    horaFim: string,
    agendamentos: Agendamento[],
    excluirAgendamentoId?: number
  ): boolean => {
    return agendamentos.some(agendamento => {
      // Pular o agendamento que está sendo editado
      if (excluirAgendamentoId && agendamento.id === excluirAgendamentoId) {
        return false
      }

      // Verificar se é a mesma data
      if (agendamento.data !== data) {
        return false
      }

      // Verificar se os campos de horário existem
      if (!agendamento.hora_inicio || !agendamento.hora_fim) {
        return false
      }

      // Verificar conflito de horário
      return temConflitoHorario(
        horaInicio,
        horaFim,
        agendamento.hora_inicio.substring(0, 5), // Remover segundos (:00+00)
        agendamento.hora_fim.substring(0, 5)
      )
    })
  }

  /**
   * Retorna uma lista de horários disponíveis para uma data específica
   * @param data - Data no formato YYYY-MM-DD
   * @param agendamentos - Lista de agendamentos existentes
   * @param horasPossiveis - Lista de horários possíveis (padrão: 8:00 às 22:00)
   * @param duracaoSlot - Duração de cada slot em minutos (padrão: 60)
   * @param excluirAgendamentoId - ID de agendamento para excluir da validação
   * @returns Lista de objetos com horário e disponibilidade
   */
  const getHorariosDisponiveis = (
    data: string,
    agendamentos: Agendamento[],
    horasPossiveis: string[] = [],
    duracaoSlot: number = 60,
    excluirAgendamentoId?: number
  ) => {
    // Se não foram fornecidas horas possíveis, gerar automaticamente
    const horariosBase = horasPossiveis.length > 0 ? horasPossiveis : gerarHorariosPadrao()

    return computed(() => {
      return horariosBase.map(horaInicio => {
        // Calcular hora fim baseado na duração do slot
        const minutosInicio = horaParaMinutos(horaInicio)
        const minutosFim = minutosInicio + duracaoSlot
        const horaFim = minutosParaHora(minutosFim)

        // Verificar se há conflito
        const temConflito = horarioConflitaComAgendamentos(
          data,
          horaInicio,
          horaFim,
          agendamentos,
          excluirAgendamentoId
        )

        return {
          hora: horaInicio,
          disponivel: !temConflito,
          conflito: temConflito
        }
      })
    })
  }

  /**
   * Converte minutos desde meia-noite para string de horário (HH:MM)
   * @param minutos - Número de minutos desde meia-noite
   * @returns String no formato HH:MM
   */
  const minutosParaHora = (minutos: number): string => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  /**
   * Gera lista de horários padrão (8:00 às 22:00)
   * @returns Array de strings no formato HH:MM
   */
  const gerarHorariosPadrao = (): string[] => {
    const horarios = []
    for (let i = 8; i <= 22; i++) {
      horarios.push(`${i.toString().padStart(2, '0')}:00`)
    }
    return horarios
  }

  /**
   * Valida se um horário de início é anterior ao horário de fim
   * @param horaInicio - Hora de início (HH:MM)
   * @param horaFim - Hora de fim (HH:MM)
   * @returns true se válido, false caso contrário
   */
  const horarioValido = (horaInicio: string, horaFim: string): boolean => {
    return horaParaMinutos(horaInicio) < horaParaMinutos(horaFim)
  }

  return {
    temConflitoHorario,
    horarioConflitaComAgendamentos,
    getHorariosDisponiveis,
    horarioValido,
    horaParaMinutos,
    minutosParaHora,
    gerarHorariosPadrao
  }
}