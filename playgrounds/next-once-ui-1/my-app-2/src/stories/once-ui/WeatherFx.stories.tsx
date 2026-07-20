import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WeatherFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/WeatherFx',
  component: WeatherFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders an animated weather overlay (rain, snow, leaves, or lightning) behind its children, useful for decorative or seasonal backgrounds.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['rain', 'snow', 'leaves', 'lightning'], description: 'Which weather effect to render.' },
    trigger: { control: 'select', options: ['mount', 'hover', 'click', 'manual'], description: 'What user action starts the effect.' },
    intensity: { control: 'number', description: 'Amount of particles produced by the effect.' },
  },
  args: {
    type: 'rain',
    trigger: 'mount',
    intensity: 1,
    colors: ['#7c93c4'],
  },
} satisfies Meta<typeof WeatherFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <WeatherFx {...args} width={20} height={12} />,
};
