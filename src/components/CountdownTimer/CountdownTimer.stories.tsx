import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import CountdownTimer from './CountdownTimer';

export default {
  component: CountdownTimer,
} as ComponentMeta<typeof CountdownTimer>;

const Template: ComponentStory<typeof CountdownTimer> = (args) => <CountdownTimer {...args} />;

export const Default = Template.bind({});
Default.args = {
  time: 300000,
};
