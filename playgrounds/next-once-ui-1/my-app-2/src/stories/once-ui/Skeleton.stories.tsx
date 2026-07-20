import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton, Row, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A placeholder loading state that mimics the shape of content while data is being fetched.',
      },
    },
  },
  argTypes: {
    shape: { control: 'select', options: ['line', 'circle', 'block'], description: 'Shape of the skeleton placeholder.' },
    width: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Width token of the skeleton.' },
    height: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Height token of the skeleton.' },
  },
  args: {
    shape: 'line',
    width: 'l',
    height: 's',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shapes: Story = {
  render: () => (
    <Column gap="16">
      <Skeleton shape="line" width="l" height="s" />
      <Row gap="16" vertical="center">
        <Skeleton shape="circle" width="m" height="m" />
        <Skeleton shape="block" width="l" height="l" />
      </Row>
    </Column>
  ),
};
