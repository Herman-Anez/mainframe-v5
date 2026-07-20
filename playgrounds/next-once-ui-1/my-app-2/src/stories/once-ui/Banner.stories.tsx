import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Banner, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Layout/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Banner is a full-width Row used to display prominent announcements or messages, typically at the top of a page.',
      },
    },
  },
  argTypes: {
    solid: { control: 'text', description: 'Solid background color token applied to the banner.' },
    horizontal: { control: 'select', options: ['start', 'center', 'end', 'between'], description: 'Horizontal alignment of the banner content.' },
    padding: { control: 'select', options: ['8', '12', '16', '24'], description: 'Padding around the banner content.' },
  },
  args: {
    horizontal: 'center',
    padding: '12',
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Banner {...args}>
      <Text onSolid="brand-strong" weight="strong">
        Announcing our new release — read the changelog.
      </Text>
    </Banner>
  ),
};
