import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Logo, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Media/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a brand logo (icon and/or wordmark), optionally as a link, with dark/light variants.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Size of the logo.' },
    dark: { control: 'boolean', description: 'Forces the dark-mode version of the logo.' },
    light: { control: 'boolean', description: 'Forces the light-mode version of the logo.' },
    wordmark: { control: 'text', description: 'Path to the wordmark image shown alongside the icon.' },
  },
  args: {
    size: 'm',
    icon: '/trademarks/icon-dark.svg',
    wordmark: '/trademarks/wordmark-dark.svg',
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Row gap="16" vertical="center">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <Logo
          key={size}
          size={size}
          icon="/trademarks/icon-dark.svg"
          wordmark="/trademarks/wordmark-dark.svg"
        />
      ))}
    </Row>
  ),
};
