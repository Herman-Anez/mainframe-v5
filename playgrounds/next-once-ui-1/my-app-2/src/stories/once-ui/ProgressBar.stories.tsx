import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A horizontal bar that visualizes progress toward completion of a task or process.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Current progress value.' },
    min: { control: 'number', description: 'Minimum value of the progress range.' },
    max: { control: 'number', description: 'Maximum value of the progress range.' },
    label: { control: 'boolean', description: 'Shows a percentage label alongside the bar.' },
    labelPosition: { control: 'select', options: ['top', 'bottom', 'left', 'right'], description: 'Position of the label relative to the bar.' },
  },
  args: {
    value: 60,
    min: 0,
    max: 100,
    label: true,
    labelPosition: 'top',
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
  render: () => (
    <Column gap="16" maxWidth={24}>
      <ProgressBar value={20} label labelPosition="top" />
      <ProgressBar value={50} label labelPosition="top" />
      <ProgressBar value={90} label labelPosition="top" />
    </Column>
  ),
};
