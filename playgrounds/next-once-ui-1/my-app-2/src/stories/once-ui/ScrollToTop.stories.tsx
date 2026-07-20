import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollToTop, Column, Text, IconButton } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Navigation/ScrollToTop',
  component: ScrollToTop,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ScrollToTop shows its children (typically a button) once the scroll position passes a given offset, and is used to jump back to the top of a scrollable area.',
      },
    },
  },
  argTypes: {
    offset: { control: 'number', description: 'Scroll distance (in pixels) after which the trigger becomes visible.' },
  },
  args: {
    offset: 100,
  },
} satisfies Meta<typeof ScrollToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Column style={{ maxHeight: 240, overflowY: 'auto' }} padding="16" gap="16">
      {Array.from({ length: 20 }).map((_, i) => (
        <Text key={i} onBackground="neutral-weak">
          Scrollable line {i + 1}
        </Text>
      ))}
      <ScrollToTop {...args}>
        <IconButton icon="chevronUp" tooltip="Scroll to top" variant="secondary" />
      </ScrollToTop>
    </Column>
  ),
};
