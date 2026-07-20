import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    min: { control: 'number' },
    max: { control: 'number' },
    label: { control: 'boolean' },
    labelPosition: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
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
