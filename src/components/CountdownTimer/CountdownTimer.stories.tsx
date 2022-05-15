import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { SocketContext } from '@/context/socket';

import CountdownTimer from './CountdownTimer';

export default {
  component: CountdownTimer,
} as ComponentMeta<typeof CountdownTimer>;

const dummySocket = {
  emit: () => {},
  on: () => {},
  off: () => {},
} as any;

const Template: ComponentStory<typeof CountdownTimer> = (args) => (
  <SocketContext.Provider value={dummySocket}>
    <CountdownTimer />
  </SocketContext.Provider>
);

export const Default = Template.bind({});
