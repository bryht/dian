import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AutoCompleteInput from '../../src/components/AutoCompleteInput/AutoCompleteInput';

describe('AutoCompleteInput', () => {
  const defaultProps = {
    id: 'test-input',
    options: ['apple', 'application', 'banana', 'apply'],
    placeholder: 'Search...',
    inputValue: '',
    onInputValueChanged: vi.fn(),
    onTypedValueChanged: vi.fn(),
    onKeyDown: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders an input with the given id', () => {
    render(<AutoCompleteInput {...defaultProps} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
  });

  it('renders with placeholder text', () => {
    render(<AutoCompleteInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('displays the inputValue', () => {
    render(<AutoCompleteInput {...defaultProps} inputValue="test" />);
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });

  it('calls onInputValueChanged and onTypedValueChanged when typing', () => {
    render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });

    expect(defaultProps.onTypedValueChanged).toHaveBeenCalledWith('app');
    expect(defaultProps.onInputValueChanged).toHaveBeenCalledWith('app');
  });

  it('shows dropdown when input has value', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });

    const list = container.querySelector('ul');
    expect(list).toHaveClass('show');
  });

  it('does not show dropdown when input is empty', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });

    const list = container.querySelector('ul');
    expect(list).not.toHaveClass('show');
  });

  it('filters options based on typed value', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });

    const items = container.querySelectorAll('li');
    // apple, application, apply contain 'app'
    expect(items.length).toBe(3);
  });

  it('calls onKeyDown when a key is pressed', () => {
    render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(defaultProps.onKeyDown).toHaveBeenCalledWith('Enter');
  });

  it('ArrowDown selects next option', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    // Type to show options
    fireEvent.change(input, { target: { value: 'app' } });
    // Press ArrowDown
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const selected = container.querySelector('li.selected');
    expect(selected).toBeTruthy();
  });

  it('ArrowUp selects previous option', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });
    // Press ArrowDown twice then ArrowUp once
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    const selected = container.querySelector('li.selected');
    expect(selected).toBeTruthy();
  });

  it('ArrowUp wraps to last option from the start', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });
    // ArrowUp from no selection should wrap to last
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    const selected = container.querySelector('li.selected');
    expect(selected).toBeTruthy();
  });

  it('ArrowDown wraps to first option from end', () => {
    const { container } = render(
      <AutoCompleteInput {...defaultProps} options={['apple']} />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'apple' } });
    // First ArrowDown selects apple, second wraps to apple
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const selected = container.querySelector('li.selected');
    expect(selected).toBeTruthy();
  });

  it('Tab hides the dropdown', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    const list = container.querySelector('ul');
    expect(list).not.toHaveClass('show');
  });

  it('blur hides the dropdown', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });
    fireEvent.blur(input);

    const list = container.querySelector('ul');
    expect(list).not.toHaveClass('show');
  });

  it('highlights the typed portion in options', () => {
    const { container } = render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'app' } });

    const typed = container.querySelectorAll('.typed');
    expect(typed.length).toBeGreaterThan(0);
    expect(typed[0].textContent).toBe('app');
  });

  it('applies custom className', () => {
    const { container } = render(
      <AutoCompleteInput {...defaultProps} className="custom-class" />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('uses default id when not provided', () => {
    const { id, ...propsWithoutId } = defaultProps;
    render(<AutoCompleteInput {...propsWithoutId} id="" />);
    // The input should still render
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
