import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CountFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/CountFx',
  component: CountFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Animates a number counting up (or down) to a target value, useful for stats, metrics, and dashboards.',
      },
    },
  },
  argTypes: {
    value: { control: 'number', description: 'Target number the count animates to.' },
    speed: { control: 'number', description: 'Duration of the count animation.' },
    easing: { control: 'select', options: ['linear', 'ease-out', 'ease-in-out'], description: 'Easing curve used for the count animation.' },
    effect: { control: 'select', options: ['simple', 'wheel', 'smooth'], description: 'Visual style used to transition between digits.' },
    decimals: { control: 'number', description: 'Number of decimal places to display.' },
  },
  args: {
    value: 1280,
    speed: 2,
    easing: 'ease-out',
    effect: 'simple',
    variant: 'display-strong-l',
  },
} satisfies Meta<typeof CountFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
