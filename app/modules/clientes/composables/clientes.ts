/**
 * PROPÓSITO: Composable para gerenciar lógica de clientes
 * IMPORTA: Cliente do módulo types
 * USADO_POR: Página clientes.vue e outros componentes relacionados
 */

import type { Cliente } from '../types/clientes.types'

export const useClientes = () => {
  // Lógica básica de clientes será adicionada aqui
  const clientes = ref<Cliente[]>([])

  /**
   * Lista todos os clientes da tabela ag_clientes
   * @returns Promise<Cliente[]> - Lista de clientes
   */
  const listarClientes = async (): Promise<Cliente[]> => {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.from('ag_clientes').select('*')
    if (error) throw error
    clientes.value = data || []
    return data || []
  }

  /**
   * Insere um novo cliente na tabela ag_clientes
   * @param cliente - Dados do novo cliente
   * @returns Promise<Cliente> - Cliente inserido
   */
  const insertCliente = async (cliente: Omit<Cliente, 'id' | 'created_at'>): Promise<Cliente> => {
    const supabase = useSupabaseClient()
    const { data, error } = await (supabase.from('ag_clientes') as any).insert([cliente]).select()
    if (error) throw error
    if (!data || data.length === 0) throw new Error('Erro ao inserir cliente')
    const clienteInserido = data[0] as unknown as Cliente
    
    // Adicionar na lista local
    clientes.value.push(clienteInserido)
    
    return clienteInserido
  }

  /**
   * Atualiza um cliente existente na tabela ag_clientes
   * @param id - ID do cliente
   * @param cliente - Dados atualizados do cliente
   * @returns Promise<Cliente> - Cliente atualizado
   */
  const updateCliente = async (id: number, cliente: Partial<Omit<Cliente, 'id' | 'created_at'>>): Promise<Cliente> => {
    const supabase = useSupabaseClient()
    const { data, error } = await (supabase.from('ag_clientes') as any).update(cliente).eq('id', id).select()
    if (error) throw error
    if (!data || data.length === 0) throw new Error('Erro ao atualizar cliente')
    const clienteAtualizado = data[0] as unknown as Cliente
    
    // Atualizar na lista local
    const index = clientes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      clientes.value[index] = clienteAtualizado
    }
    
    return clienteAtualizado
  }

  /**
   * Remove um cliente da tabela ag_clientes
   * @param id - ID do cliente a ser removido
   * @returns Promise<void>
   */
  const deleteCliente = async (id: number): Promise<void> => {
    const supabase = useSupabaseClient()
    const { error } = await (supabase.from('ag_clientes') as any).delete().eq('id', id)
    if (error) throw error
    
    // Remover da lista local
    const index = clientes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      clientes.value.splice(index, 1)
    }
  }

  /**
   * Formata CPF com máscara
   * @param value - Valor do CPF
   * @returns CPF formatado
   */
  const formatCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  /**
   * Formata telefone com máscara
   * @param value - Valor do telefone
   * @returns Telefone formatado
   */
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 11) {
      const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/)
      if (match) {
        return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`
      }
      return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4')
    }
    return value
  }

  /**
   * Valida CPF
   * @param cpf - CPF a ser validado
   * @returns true se válido
   */
  const validateCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleaned)) return false
    
    // Calcula primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]!) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10) remainder = 0
    if (remainder !== parseInt(cleaned[9]!)) return false
    
    // Calcula segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]!) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10) remainder = 0
    if (remainder !== parseInt(cleaned[10]!)) return false
    
    return true
  }

  /**
   * Valida email
   * @param email - Email a ser validado
   * @returns true se válido
   */
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) ? '' : 'Email inválido'
  }

  /**
   * Remove máscara do CPF
   * @param cpf - CPF com máscara
   * @returns CPF sem máscara
   */
  const cleanCPF = (cpf: string): string => {
    return cpf.replace(/\D/g, '')
  }

  /**
   * Remove máscara do telefone
   * @param phone - Telefone com máscara
   * @returns Telefone sem máscara
   */
  const cleanPhone = (phone: string): string => {
    return phone.replace(/\D/g, '')
  }

  return {
    clientes,
    listarClientes,
    insertCliente,
    updateCliente,
    deleteCliente,
    formatCPF,
    formatPhone,
    validateCPF,
    validateEmail,
    cleanCPF,
    cleanPhone
  }
}