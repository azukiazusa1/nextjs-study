import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Avatar from './Avatar';

export default {
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  alt: 'user',
  src: '/images/1.png',
};
