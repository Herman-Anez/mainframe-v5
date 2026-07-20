import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tag, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A small label used to categorize or highlight an item, such as a status or category marker.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'accent', 'info', 'danger', 'warning', 'success', 'gradient'],
      description: 'Color scheme of the tag.',
    },
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the tag.' },
    prefixIcon: { control: 'text', description: 'Icon rendered before the label.' },
    suffixIcon: { control: 'text', description: 'Icon rendered after the label.' },
    label: { control: 'text', description: 'Text displayed inside the tag.' },
  },
  args: {
    label: 'New',
    variant: 'brand',
    size: 'm',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="12" wrap>
      {(['neutral', 'brand', 'accent', 'info', 'danger', 'warning', 'success', 'gradient'] as const).map((variant) => (
        <Tag key={variant} variant={variant} label={variant} />
      ))}
    </Row>
  ),
};
