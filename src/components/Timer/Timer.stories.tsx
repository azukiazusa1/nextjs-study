import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Timer from './Timer';

export default {
  component: Timer,
} as ComponentMeta<typeof Timer>;

const Template: ComponentStory<typeof Timer> = (args) => <Timer {...args} />;

export const Default = Template.bind({});
Default.args = {
  minutes: 24,
  seconds: 11,
};
