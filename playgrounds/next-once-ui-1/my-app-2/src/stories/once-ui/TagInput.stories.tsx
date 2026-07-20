import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { TagInput } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'TagInput is a text field that lets users add and remove a list of free-form string tags.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Floating label text for the field.' },
    placeholder: { control: 'text', description: 'Placeholder text shown when empty.' },
    error: { control: 'boolean', description: 'Whether the field is displayed in an error state.' },
  },
  args: {
    id: 'tag-input-default',
    label: 'Skills',
    placeholder: 'Type and press enter',
    value: ['react', 'typescript'],
    onChange: () => {},
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const TagInputWithState = () => {
      const [value, setValue] = useState(args.value);
      return <TagInput {...args} value={value} onChange={setValue} />;
    };
    return <TagInputWithState />;
  },
};
