import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A visual representation of a user, showing a profile image, initials, or an empty placeholder state.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Size of the avatar.' },
    loading: { control: 'boolean', description: 'Shows the avatar in a loading state.' },
    empty: { control: 'boolean', description: 'Shows an empty placeholder instead of an image or initials.' },
    value: { control: 'text', description: 'Initials or text displayed when no image is available.' },
    src: { control: 'text', description: 'URL of the image to display.' },
  },
  args: {
    value: 'JD',
    size: 'm',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Row gap="12" vertical="center">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <Avatar key={size} value="JD" size={size} />
      ))}
    </Row>
  ),
};

export const WithStatus: Story = {
  args: { statusIndicator: { color: 'green' } },
};
