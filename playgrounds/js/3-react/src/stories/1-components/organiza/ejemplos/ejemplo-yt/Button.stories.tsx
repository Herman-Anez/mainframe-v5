import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import Button from "./Button";

interface ButtonArgs {
  label: string;
  backgroundColor: string;
  size: "sm" | "md" | "lg";
  handleClick?: () => void;
}

const meta: Meta<ButtonArgs> = {
  title: "Ejemplo-yt/Button",
  component: Button,
  argTypes: { handleClick: { action: "handleClick" } },
};

export default meta;

const Template: StoryFn<ButtonArgs> = (args) => <Button {...args} />;

export const Red = Template.bind({});
Red.args = { backgroundColor: "red", label: "Press Me", size: "md" };

export const Green = Template.bind({});
Green.args = { backgroundColor: "green", label: "Press Me", size: "md" };

export const Small = Template.bind({});
Small.args = { backgroundColor: "red", label: "Press Me", size: "sm" };

export const Large = Template.bind({});
Large.args = { backgroundColor: "red", label: "Press Me", size: "lg" };

export const LongLabel = Template.bind({});
LongLabel.args = { backgroundColor: "red", label: "Press Me adsf asdf asdf asdfasdfasd fasd fasd fasd", size: "md" };
