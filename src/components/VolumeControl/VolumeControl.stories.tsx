import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import VolumeControl from './VolumeControl';

export default {
  component: VolumeControl,
} as ComponentMeta<typeof VolumeControl>;

const Template: ComponentStory<typeof VolumeControl> = (args) => {
  const [value, setValue] = useState(args.volume ?? '');
  return (
    <VolumeControl
      {...args}
      onVolumeChange={(...params) => {
        args.onVolumeChange(...params);
        setValue(...params);
      }}
      volume={value}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  volume: 0.5,
};
