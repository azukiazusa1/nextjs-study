import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { SocketContext } from '@/context/socket';

import JoinRoomForm from './JoinRoomForm';

export default {
  component: JoinRoomForm,
} as ComponentMeta<typeof JoinRoomForm>;

const dummySocket = {
  emit: () => {},
  on: () => {},
  off: () => {},
} as any;

const Template: ComponentStory<typeof JoinRoomForm> = (args) => (
  <SocketContext.Provider value={dummySocket}>
    <JoinRoomForm />
  </SocketContext.Provider>
);

export const Default = Template.bind({});
