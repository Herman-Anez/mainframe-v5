import type { Meta, StoryFn } from '@storybook/react-vite';

import SubmitButton  from '../../basic/buttons/submit/submitButton.component';

import Articulo  from '../../markdown/articulo';



const meta: Meta<typeof Articulo> = {
  title: 'markdown/baseComponent',
  component: SubmitButton,
};

export default meta;

const Template: StoryFn<typeof Articulo> = () => <Articulo  />



export const BaseExample = Template


