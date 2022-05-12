import { ComponentMeta,ComponentStory } from '@storybook/react';
import React from 'react';

import Button from './Button';

export default {
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (_) => <Button />;

export const Default = Template.bind({});
