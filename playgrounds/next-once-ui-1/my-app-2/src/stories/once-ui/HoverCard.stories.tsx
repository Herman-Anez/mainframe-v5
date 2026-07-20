import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HoverCard, SmartLink, Card, Text, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'HoverCard shows floating content next to a trigger element when the user hovers over it, useful for previews and tooltips with rich content.',
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <HoverCard trigger={<SmartLink href="#">Hover over me</SmartLink>}>
      <Card padding="16" radius="m" border="neutral-alpha-medium" maxWidth={16}>
        <Column gap="4">
          <Text weight="strong">Preview</Text>
          <Text onBackground="neutral-weak">Extra detail shown on hover.</Text>
        </Column>
      </Card>
    </HoverCard>
  ),
};
