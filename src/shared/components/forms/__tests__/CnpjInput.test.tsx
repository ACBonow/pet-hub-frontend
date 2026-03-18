/**
 * @module shared
 * @file CnpjInput.test.tsx
 * @description Tests for the CnpjInput form component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import CnpjInput from '@/shared/components/forms/CnpjInput'

function TestForm({ defaultValue = '' }: { defaultValue?: string }) {
  const { control } = useForm({ mode: 'onBlur', defaultValues: { cnpj: defaultValue } })
  return (
    <form>
      <CnpjInput control={control} name="cnpj" label="CNPJ" />
    </form>
  )
}

describe('CnpjInput', () => {
  it('should render input with label', () => {
    render(<TestForm />)
    expect(screen.getByLabelText('CNPJ')).toBeInTheDocument()
  })

  it('should have inputMode="numeric"', () => {
    render(<TestForm />)
    expect(screen.getByLabelText('CNPJ')).toHaveAttribute('inputMode', 'numeric')
  })

  it('should apply CNPJ mask as user types', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CNPJ')

    await userEvent.type(input, '11222333000181')

    expect(input).toHaveValue('11.222.333/0001-81')
  })

  it('should not exceed 18 characters in display (CNPJ mask length)', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CNPJ')

    await userEvent.type(input, '112223330001812345') // extra digits

    expect((input as HTMLInputElement).value.length).toBeLessThanOrEqual(18)
  })

  it('should show error "CNPJ inválido" for invalid CNPJ after blur', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CNPJ')

    await userEvent.type(input, '11111111111111')
    await userEvent.tab()

    expect(await screen.findByText('CNPJ inválido')).toBeInTheDocument()
  })

  it('should NOT show error for a valid CNPJ after blur', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CNPJ')

    await userEvent.type(input, '11222333000181')
    await userEvent.tab()

    expect(screen.queryByText('CNPJ inválido')).not.toBeInTheDocument()
  })

  it('should NOT show error when field is empty (optional)', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CNPJ')

    await userEvent.click(input)
    await userEvent.tab()

    expect(screen.queryByText('CNPJ inválido')).not.toBeInTheDocument()
  })
})
