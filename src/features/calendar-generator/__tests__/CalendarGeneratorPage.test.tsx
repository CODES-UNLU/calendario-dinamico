import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CalendarGeneratorPage } from '../components/CalendarGeneratorPage';

describe('CalendarGeneratorPage', () => {
  it('actualiza la vista previa al cambiar de mes y año', async () => {
    const user = userEvent.setup();
    render(<CalendarGeneratorPage />);

    const monthSelect = screen.getByLabelText('Mes');
    await user.selectOptions(monthSelect, '2');

    const poster = screen.getAllByTestId('calendar-poster')[0];
    expect(within(poster).getByText('Febrero')).toBeInTheDocument();
  });

  it('permite agregar, editar y eliminar un acontecimiento usando solo el número de día', async () => {
    const user = userEvent.setup();
    render(<CalendarGeneratorPage />);

    await user.selectOptions(screen.getByLabelText('Mes'), '11');
    await user.selectOptions(screen.getByLabelText('Año'), '2026');

    await user.type(screen.getByLabelText('Título *'), 'Paro nodocente');
    const dayInput = screen.getByLabelText(/Día \*/i);
    await user.clear(dayInput);
    await user.type(dayInput, '3');
    await user.click(screen.getByRole('button', { name: 'Agregar acontecimiento' }));

    const poster = screen.getAllByTestId('calendar-poster')[0];
    expect(within(poster).getByText('Paro nodocente')).toBeInTheDocument();
    expect(within(poster).getByText('3 de noviembre')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Editar Paro nodocente' }));
    const titleInput = screen.getByLabelText('Título *');
    await user.clear(titleInput);
    await user.type(titleInput, 'Asueto académico');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(within(poster).getByText('Asueto académico')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Eliminar Asueto académico' }));
    expect(within(poster).queryByText('Asueto académico')).not.toBeInTheDocument();
  });

  it('carga los datos de ejemplo y muestra el aviso de modo ejemplo', async () => {
    const user = userEvent.setup();
    render(<CalendarGeneratorPage />);

    await user.click(screen.getByRole('button', { name: /Cargar ejemplo/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/Modo ejemplo activo/i);
    const poster = screen.getAllByTestId('calendar-poster')[0];
    expect(within(poster).getByText('Noviembre')).toBeInTheDocument();
    expect(
      within(poster).getByText('Charla profesional en vivo con Gabriel Tolosa')
    ).toBeInTheDocument();
  });
});
