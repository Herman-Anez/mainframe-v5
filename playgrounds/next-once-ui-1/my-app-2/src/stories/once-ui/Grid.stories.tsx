import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Grid, Flex } from '@once-ui-system/core';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <Flex
    padding="16"
    radius="m"
    background="neutral-alpha-weak"
    border="neutral-alpha-medium"
    horizontal="center"
    vertical="center"
  >
    {children}
  </Flex>
);

const meta = {
  title: 'Once UI/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Grid is a CSS grid container used to lay out children into rows and columns with a configurable column count and gap.',
      },
    },
  },
  argTypes: {
    columns: { control: 'select', options: ['2', '3', '4', '6'], description: 'Number of grid columns.' },
    gap: { control: 'select', options: ['4', '8', '12', '16', '24'], description: 'Spacing between grid cells.' },
  },
  args: {
    columns: '3',
    gap: '12',
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <Cell key={n}>{n}</Cell>
      ))}
    </Grid>
  ),
};
