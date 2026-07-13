import type { Meta, StoryFn } from '@storybook/react-vite';
import componentSelector from './componentSelector';



const meta: Meta<typeof componentSelector.Stateful> = {
  title: 'Ejemplos/ComponentSelector',
  component: componentSelector.Stateful,
};

export default meta;


/////////dumb component
const Template: StoryFn<typeof componentSelector.Stateful> = () => <componentSelector.Stateful />


export const Stateful = Template.bind({})

const DumbTemplate: StoryFn<typeof componentSelector.Dumb> = () => (
    <componentSelector.Dumb />
)

export const Dumb = DumbTemplate.bind({})

