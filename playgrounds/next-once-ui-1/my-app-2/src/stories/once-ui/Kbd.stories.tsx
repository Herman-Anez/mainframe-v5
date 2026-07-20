import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Kbd, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Typography/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a keyboard key or shortcut in a styled badge, e.g. for documenting keyboard shortcuts.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Text of the key shown inside the badge.' },
  },
  args: {
    label: 'Enter',
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Combo: Story = {
  render: () => (
    <Row gap="4" vertical="center">
      <Kbd label="Ctrl" />
      <Kbd label="Shift" />
      <Kbd label="P" />
    </Row>
  ),
};
