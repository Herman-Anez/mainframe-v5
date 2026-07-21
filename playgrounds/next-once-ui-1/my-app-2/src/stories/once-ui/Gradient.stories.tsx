import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LinearGradient, RadialGradient } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Charts/Gradient',
  component: LinearGradient,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'LinearGradient and RadialGradient define reusable SVG <defs> gradients used internally by the "gradient" chart variant (BarChart, LineChart, PieChart fills). Meant to be used inside an <svg>, not on their own.',
      },
    },
  },
  args: {
    id: 'demo-linear-gradient',
    color: '#7c93c4',
  },
} satisfies Meta<typeof LinearGradient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <svg width={200} height={100}>
      <defs>
        <LinearGradient {...args} />
        <RadialGradient id="demo-radial-gradient" color="#c47c7c" />
      </defs>
      <rect x={0} y={0} width={90} height={100} fill="url(#demo-linear-gradient)" />
      <rect x={100} y={0} width={90} height={100} fill="url(#demo-radial-gradient)" />
    </svg>
  ),
};
