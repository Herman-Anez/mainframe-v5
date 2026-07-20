import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleButton, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Actions/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A button that toggles between a selected and unselected state, used standalone or as a building block for SegmentedControl.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'outline', 'subtle'], description: 'Visual style of the button.' },
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the button.' },
    selected: { control: 'boolean', description: 'Whether the button is in the selected state.' },
    disabled: { control: 'boolean', description: 'Disables interaction with the button.' },
    label: { control: 'text', description: 'Text label displayed on the button.' },
    prefixIcon: { control: 'text', description: 'Name of the icon shown before the label.' },
  },
  args: {
    label: 'Bold',
    variant: 'outline',
    selected: false,
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Variants: Story = {
  render: () => (
    <Row gap="12">
      {(['ghost', 'outline', 'subtle'] as const).map((variant) => (
        <ToggleButton key={variant} variant={variant} label={variant} selected />
      ))}
    </Row>
  ),
};
