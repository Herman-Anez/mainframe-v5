import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A multi-line text field for entering longer form content, with support for labels, errors, and resizing.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'ghost'], description: 'Visual style of the textarea.' },
    height: { control: 'select', options: ['s', 'm', 'l'], description: 'Height of the textarea.' },
    resize: { control: 'select', options: ['horizontal', 'vertical', 'both', 'none'], description: 'Direction the textarea can be resized.' },
    lines: { control: 'number', description: 'Number of visible text lines.' },
    error: { control: 'boolean', description: 'Shows the textarea in an error state.' },
    disabled: { control: 'boolean', description: 'Disables the textarea and prevents interaction.' },
    characterCount: { control: 'boolean', description: 'Displays a character count below the textarea.' },
    label: { control: 'text', description: 'Label text displayed above the textarea.' },
    placeholder: { control: 'text', description: 'Placeholder text shown when the textarea is empty.' },
    description: { control: 'text', description: 'Helper text displayed below the textarea.' },
    errorMessage: { control: 'text', description: 'Message shown below the textarea when in an error state.' },
  },
  args: {
    id: 'textarea-default',
    label: 'Message',
    placeholder: 'Write something...',
    lines: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <Column gap="16" maxWidth={24}>
      <Textarea id="textarea-default-state" label="Default" placeholder="Type here" lines={3} />
      <Textarea id="textarea-disabled-state" label="Disabled" placeholder="Type here" lines={3} disabled />
      <Textarea id="textarea-error-state" label="Error" placeholder="Type here" lines={3} error errorMessage="This field is required" />
    </Column>
  ),
};
