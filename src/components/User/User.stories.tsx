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
  image:
    'https://images.unsplash.com/photo-1584361853901-dd1904bb7987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
  status: 'online',
  quantity: 12,
};

export const isOffline = Template.bind({});
isOffline.args = {
  username: '@johndoe',
  image:
    'https://images.unsplash.com/photo-1584361853901-dd1904bb7987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
  status: 'offline',
  quantity: 12,
};
