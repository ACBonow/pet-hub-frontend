/**
 * @module shared
 * @file CpfInput.test.tsx
 * @description Tests for the CpfInput form component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import CpfInput from '@/shared/components/forms/CpfInput'

function TestForm({ defaultValue = '' }: { defaultValue?: string }) {
  const { control } = useForm({ mode: 'onBlur', defaultValues: { cpf: defaultValue } })
  return (
    <form>
      <CpfInput control={control} name="cpf" label="CPF" />
    </form>
  )
}

describe('CpfInput', () => {
  it('should render input with label', () => {
    render(<TestForm />)
    expect(screen.getByLabelText('CPF')).toBeInTheDocument()
  })

  it('should have inputMode="numeric"', () => {
    render(<TestForm />)
    expect(screen.getByLabelText('CPF')).toHaveAttribute('inputMode', 'numeric')
  })

  it('should apply CPF mask as user types', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CPF')

    await userEvent.type(input, '52998224725')

    expect(input).toHaveValue('529.982.247-25')
  })

  it('should not exceed 14 characters in display (CPF mask length)', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CPF')

    await userEvent.type(input, '529982247251234') // extra digits

    expect((input as HTMLInputElement).value.length).toBeLessThanOrEqual(14)
  })

  it('should show error "CPF inválido" for invalid CPF after blur', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CPF')

    await userEvent.type(input, '11111111111')
    await userEvent.tab()

    expect(await screen.findByText('CPF inválido')).toBeInTheDocument()
  })

  it('should NOT show error for a valid CPF after blur', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CPF')

    await userEvent.type(input, '52998224725')
    await userEvent.tab()

    expect(screen.queryByText('CPF inválido')).not.toBeInTheDocument()
  })

  it('should NOT show error when field is empty (optional)', async () => {
    render(<TestForm />)
    const input = screen.getByLabelText('CPF')

    await userEvent.click(input)
    await userEvent.tab()

    expect(screen.queryByText('CPF inválido')).not.toBeInTheDocument()
  })
})
