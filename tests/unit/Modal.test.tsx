import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-modal
vi.mock('react-modal', () => {
  const MockModal = ({ isOpen, children }: any) => {
    if (!isOpen) return null;
    return <div data-testid="react-modal">{children}</div>;
  };
  MockModal.setAppElement = vi.fn();
  return { default: MockModal };
});

import Modal from '../../src/components/Modal';
import type { IModalRef } from '../../src/components/Modal';

describe('Modal', () => {
  it('is closed by default', () => {
    render(
      <Modal>
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('opens when openModal is called via ref', async () => {
    const ref = React.createRef<IModalRef>();
    render(
      <Modal ref={ref}>
        <p>Modal Content</p>
      </Modal>
    );

    act(() => {
      ref.current!.openModal();
    });

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('closes when closeModal is called via ref', async () => {
    const ref = React.createRef<IModalRef>();
    render(
      <Modal ref={ref}>
        <p>Modal Content</p>
      </Modal>
    );

    act(() => {
      ref.current!.openModal();
    });
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    act(() => {
      ref.current!.closeModal();
    });
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls onModalClosed callback when closed', () => {
    const onClosed = vi.fn();
    const ref = React.createRef<IModalRef>();
    render(
      <Modal ref={ref} onModalClosed={onClosed}>
        <p>Content</p>
      </Modal>
    );

    act(() => {
      ref.current!.openModal();
    });
    act(() => {
      ref.current!.closeModal();
    });

    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it('renders close button when open', () => {
    const ref = React.createRef<IModalRef>();
    render(
      <Modal ref={ref}>
        <p>Content</p>
      </Modal>
    );

    act(() => {
      ref.current!.openModal();
    });

    const closeBtn = screen.getByRole('button');
    expect(closeBtn).toHaveClass('btn-close');
  });

  it('close button closes the modal', async () => {
    const onClosed = vi.fn();
    const ref = React.createRef<IModalRef>();
    const user = userEvent.setup();
    render(
      <Modal ref={ref} onModalClosed={onClosed}>
        <p>Content</p>
      </Modal>
    );

    act(() => {
      ref.current!.openModal();
    });

    const closeBtn = screen.getByRole('button');
    await user.click(closeBtn);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    expect(onClosed).toHaveBeenCalled();
  });

  it('renders children content inside modal body', () => {
    const ref = React.createRef<IModalRef>();
    render(
      <Modal ref={ref}>
        <h2>Title</h2>
        <p>Description</p>
      </Modal>
    );

    act(() => {
      ref.current!.openModal();
    });

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
