import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a named icon from the Once UI icon set, with optional tooltip and color.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Size of the icon.' },
    name: { control: 'text', description: 'Name of the icon to render from the icon set.' },
    onBackground: { control: 'text', description: 'Color of the icon relative to its background.' },
  },
  args: {
    name: 'check',
    size: 'm',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
  render: () => (
    <Row gap="16" wrap>
      {(['check', 'close', 'info', 'warning', 'danger', 'search', 'plus', 'refresh', 'calendar', 'person'] as const).map(
        (name) => (
          <Icon key={name} name={name} size="m" />
        )
      )}
    </Row>
  ),
};
