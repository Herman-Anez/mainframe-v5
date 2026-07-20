import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InfiniteScroll, Text } from '@once-ui-system/core';

const initialItems = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

const meta = {
  title: 'Once UI/Media/InfiniteScroll',
  component: InfiniteScroll,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a list of items and calls loadMore to fetch additional items as the user scrolls near the end.',
      },
    },
  },
  args: {
    items: initialItems,
    renderItem: (item: unknown) => <Text key={item as string}>{item as string}</Text>,
    loadMore: async () => false,
  },
} satisfies Meta<typeof InfiniteScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InfiniteScroll
      items={initialItems}
      renderItem={(item) => (
        <Text key={item} onBackground="neutral-weak" style={{ padding: '8px 0' }}>
          {item}
        </Text>
      )}
      loadMore={async () => false}
      direction="column"
      style={{ maxHeight: 240, overflowY: 'auto' }}
    />
  ),
};
