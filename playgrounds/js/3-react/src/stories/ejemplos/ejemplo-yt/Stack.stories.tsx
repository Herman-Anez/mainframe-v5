import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import Stack from "./Stack";

interface TemplateArgs {
  numberOfChildren: number;
  direction?: "row" | "column";
  spacing?: number;
  wrap?: boolean;
  children?: React.ReactNode;
}

const meta: Meta<TemplateArgs> = {
  title: "Ejemplo-yt/Stack",
  component: Stack as React.ComponentType<TemplateArgs>,
  argTypes: {
    numberOfChildren: { control: { type: "number" } },
  },
};

export default meta;

const Template: StoryFn<TemplateArgs> = ({ numberOfChildren, ...args }) => (
  <Stack {...args}>
    {[...Array(numberOfChildren).keys()].map(n => (
      <div
        key={n}
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {n + 1}
      </div>
    ))}
  </Stack>
);

export const Horizontal = Template.bind({});
Horizontal.args = { direction: "row", spacing: 2, wrap: false, numberOfChildren: 4 };

export const Vertical = Template.bind({});
Vertical.args = { direction: "column", spacing: 2, wrap: false, numberOfChildren: 4 };

export const NoSpacing = Template.bind({});
NoSpacing.args = { direction: "row", spacing: 0, wrap: false, numberOfChildren: 4 };

export const WrapOverflow = Template.bind({});
WrapOverflow.args = { numberOfChildren: 40, direction: "row", spacing: 2, wrap: true };

export const Empty = Template.bind({});
Empty.args = { numberOfChildren: 0, direction: "row", spacing: 2, wrap: false };
