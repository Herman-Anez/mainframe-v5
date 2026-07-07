import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Form from './form';

type FormState = { userId: string; name: string; message: string };

const meta: Meta<typeof Form> = {
  title: 'Exemplo-form/Form',
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

const mockSuccess = async (_state: FormState, _formData: FormData): Promise<FormState> => {
  await new Promise(r => setTimeout(r, 1000));
  return { userId: '1', name: 'Herman', message: 'success' };
};

const mockError = async (_state: FormState, _formData: FormData): Promise<FormState> => {
  await new Promise(r => setTimeout(r, 1000));
  return { userId: '1', name: '', message: 'Error al guardar' };
};

export const Default: Story = {
  args: {
    userId: '123',
    updateNameAction: mockSuccess,
  },
};

export const WithError: Story = {
  args: {
    userId: '123',
    updateNameAction: mockError,
  },
};
