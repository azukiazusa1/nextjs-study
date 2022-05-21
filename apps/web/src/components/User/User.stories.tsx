import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import User from './User';

export default {
  component: User,
} as ComponentMeta<typeof User>;

const Template: ComponentStory<typeof User> = (args) => <User {...args} />;

export const Default = Template.bind({});
Default.args = {
  username: '@johndoe',
  image: '/images/1.png',
  status: 'online',
  score: 12,
};

export const isOffline = Template.bind({});
isOffline.args = {
  username: '@johndoe',
  image: '/images/1.png',
  status: 'offline',
  score: 12,
};

export const hasMessage = Template.bind({});
hasMessage.args = {
  username: '@johndoe',
  image: '/images/1.png',
  status: 'online',
  score: 12,
  message: '👍',
};
