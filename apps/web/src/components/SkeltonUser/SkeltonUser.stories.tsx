import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import SkeltonUser from './SkeltonUser';

export default {
  component: SkeltonUser,
} as ComponentMeta<typeof SkeltonUser>;

const Template: ComponentStory<typeof SkeltonUser> = (args) => <SkeltonUser {...args} />;

export const Default = Template.bind({});
