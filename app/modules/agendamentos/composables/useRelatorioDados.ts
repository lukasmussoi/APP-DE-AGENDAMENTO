/**
 * PROPÓSITO: Composable para gerenciar dados de clientes e profissionais ativos para relatórios
 * IMPORTA: useClientes, useProfissionais
 * USADO_POR: RelatorioContainer.vue
 */

import { useClientes } from '../../clientes/composables/clientes'
import { useProfissionais } from '../../profissionais/composables/profissionais'
import type { Cliente } from '../../clientes/types/clientes.types'
import type { Profissional } from '../../profissionais/types/especialidade.types'

export const useRelatorioDados = () => {
  // Estado reativo
  const clientesAtivos = ref<Cliente[]>([])
  const profissionaisAtivos = ref<Profissional[]>([])
  const loadingClientes = ref(false)
  const loadingProfissionais = ref(false)
  const errorClientes = ref<string | null>(null)
  const errorProfissionais = ref<string | null>(null)

  // Função para carregar clientes ativos
  const carregarClientesAtivos = async () => {
    // Evitar múltiplas chamadas simultâneas
    if (loadingClientes.value) return

    try {
      loadingClientes.value = true
      errorClientes.value = null

      const { listarClientes } = useClientes()
      const clientes = await listarClientes()

      // Filtrar apenas clientes ativos (considerando que todos são ativos por padrão)
      // Se houver campo de status no futuro, filtrar aqui
      clientesAtivos.value = clientes

      console.log('Clientes ativos carregados:', clientesAtivos.value.length)
    } catch (err: any) {
      errorClientes.value = err.message
      console.error('Erro ao carregar clientes ativos:', err)
    } finally {
      loadingClientes.value = false
    }
  }

  // Função para carregar profissionais ativos
  const carregarProfissionaisAtivos = async () => {
    // Evitar múltiplas chamadas simultâneas
    if (loadingProfissionais.value) return

    try {
      loadingProfissionais.value = true
      errorProfissionais.value = null

      console.log('Iniciando carregamento de profissionais via RPC...')

      const supabase = useSupabaseClient()
      const { data, error: rpcError } = await supabase.rpc('ag_listar_profissionais_admin') as { data: any, error: any }

      console.log('Resposta da RPC ag_listar_profissionais_admin:', data)
      console.log('Erro da RPC:', rpcError)

      if (rpcError) throw rpcError

      // Processar o retorno da RPC - tentar diferentes estruturas possíveis
      let response: any = null

      if (Array.isArray(data) && data.length > 0) {
        // Se é array, pode ser data[0]['ag_listar_profissionais_admin'] ou data[0] diretamente
        if (data[0]['ag_listar_profissionais_admin']) {
          response = data[0]['ag_listar_profissionais_admin']
        } else {
          response = data[0]
        }
      } else if (data && typeof data === 'object') {
        // Se é objeto, pode ser data['ag_listar_profissionais_admin'] ou data diretamente
        if (data['ag_listar_profissionais_admin']) {
          response = data['ag_listar_profissionais_admin']
        } else {
          response = data
        }
      }

      console.log('Response processada:', response)

      if (response && response.success) {
        profissionaisAtivos.value = response.data || []
        console.log('Profissionais ativos carregados:', profissionaisAtivos.value.length)
        console.log('Dados dos profissionais:', profissionaisAtivos.value)
      } else if (response) {
        throw new Error(response.message || 'Erro ao buscar profissionais')
      } else {
        // Se não conseguiu parsear, assumir array vazio
        profissionaisAtivos.value = []
        console.warn('Não foi possível parsear a resposta da RPC:', data)
      }
    } catch (err: any) {
      errorProfissionais.value = err.message
      console.error('Erro ao carregar profissionais ativos:', err)
    } finally {
      loadingProfissionais.value = false
    }
  }

  // Função para carregar todos os dados necessários para relatórios
  const carregarDadosRelatorio = async () => {
    console.log('Iniciando carregamento de dados para relatórios...')

    // Carregar clientes e profissionais em paralelo
    await Promise.all([
      carregarClientesAtivos(),
      carregarProfissionaisAtivos()
    ])

    console.log('Dados para relatórios carregados com sucesso')
  }

  // Computed para verificar se está carregando
  const loading = computed(() => loadingClientes.value || loadingProfissionais.value)

  // Computed para verificar se há erros
  const error = computed(() => errorClientes.value || errorProfissionais.value)

  return {
    // Estado
    clientesAtivos,
    profissionaisAtivos,
    loadingClientes,
    loadingProfissionais,
    errorClientes,
    errorProfissionais,
    loading,
    error,

    // Ações
    carregarClientesAtivos,
    carregarProfissionaisAtivos,
    carregarDadosRelatorio
  }
}