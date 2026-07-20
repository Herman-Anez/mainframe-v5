import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollContainer, Flex, Text } from '@once-ui-system/core';

const items = Array.from({ length: 6 }, (_, i) => (
  <Flex
    key={i}
    width={20}
    height={12}
    radius="m"
    background="neutral-alpha-weak"
    border="neutral-alpha-medium"
    horizontal="center"
    vertical="center"
  >
    <Text onBackground="neutral-weak">{i + 1}</Text>
  </Flex>
));

const meta = {
  title: 'Once UI/Layout/ScrollContainer',
  component: ScrollContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A horizontally scrollable row of items with previous/next controls positioned around it.',
      },
    },
  },
  argTypes: {
    controlPlacement: {
      control: 'select',
      options: ['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end'],
      description: 'Position of the navigation controls relative to the container.',
    },
  },
  args: {
    items,
    controlPlacement: 'top-end',
  },
} satisfies Meta<typeof ScrollContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ScrollContainer {...args} gap="12" style={{ maxWidth: 400 }} />,
};
