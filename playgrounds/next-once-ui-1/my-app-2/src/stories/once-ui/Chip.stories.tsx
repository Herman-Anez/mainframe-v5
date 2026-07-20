import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Chip, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Chip is a small, compact label used to represent a tag, filter, or selectable option, optionally removable.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Text displayed inside the chip.' },
    selected: { control: 'boolean', description: 'Whether the chip is shown in a selected state.' },
    prefixIcon: { control: 'text', description: 'Name of an icon shown before the label.' },
  },
  args: {
    label: 'React',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removable: Story = {
  args: { onRemove: () => {} },
};

export const Group: Story = {
  render: () => (
    <Row gap="8" wrap>
      <Chip label="React" selected onRemove={() => {}} />
      <Chip label="TypeScript" onRemove={() => {}} />
      <Chip label="Next.js" onRemove={() => {}} />
    </Row>
  ),
};
