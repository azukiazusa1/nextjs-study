import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { SocketContext } from '@/context/socket';

import EmojiPicker from './EmojiPicker';

export default {
  component: EmojiPicker,
} as ComponentMeta<typeof EmojiPicker>;

const dummySocket = {
  emit: () => {},
  on: () => {},
  off: () => {},
} as any;

const Template: ComponentStory<typeof EmojiPicker> = (args) => (
  <SocketContext.Provider value={dummySocket}>
    <EmojiPicker />
  </SocketContext.Provider>
);

export const Default = Template.bind({});
