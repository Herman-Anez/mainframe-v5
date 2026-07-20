import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A compact button that shows only an icon, used for toolbar actions or space-constrained controls.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'subtle', 'danger', 'success', 'warning', 'ghost', 'link'],
      description: 'Visual style of the button.',
    },
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Size of the button.' },
    rounded: { control: 'boolean', description: 'Renders the button with fully rounded corners.' },
    disabled: { control: 'boolean', description: 'Disables the button and prevents interaction.' },
    loading: { control: 'boolean', description: 'Shows a loading spinner and disables interaction.' },
    icon: { control: 'text', description: 'Name of the icon displayed inside the button.' },
    tooltip: { control: 'text', description: 'Text shown in a tooltip on hover.' },
  },
  args: {
    icon: 'check',
    variant: 'primary',
    size: 'm',
    tooltip: 'Confirm',
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="12" wrap>
      {(['primary', 'secondary', 'tertiary', 'quaternary', 'subtle', 'danger', 'success', 'warning', 'ghost', 'link'] as const).map((variant) => (
        <IconButton key={variant} variant={variant} icon="check" tooltip={variant} />
      ))}
    </Row>
  ),
};
