import type { Meta, StoryFn } from '@storybook/react-vite';

import SubmitButton  from '../1-components/basic/buttons/submit/submitButton.component';

import Articulo  from '../1-components/markdown/articulo';



const meta: Meta<typeof Articulo> = {
  title: 'markdown/baseComponent',
  component: SubmitButton,
};

export default meta;

const Template: StoryFn<typeof Articulo> = () => <Articulo  />



export const BaseExample = Template


