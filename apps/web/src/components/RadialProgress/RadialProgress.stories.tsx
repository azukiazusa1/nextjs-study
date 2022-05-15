import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import RadialProgress from './RadialProgress';

export default {
  component: RadialProgress,
} as ComponentMeta<typeof RadialProgress>;

const Template: ComponentStory<typeof RadialProgress> = (_) => (
  <div className="flex gap-4">
    <RadialProgress progress={0}>0%</RadialProgress>
    <RadialProgress progress={20}>20%</RadialProgress>
    <RadialProgress progress={50}>50%</RadialProgress>
    <RadialProgress progress={75}>75%</RadialProgress>
    <RadialProgress progress={100}>100%</RadialProgress>
  </div>
);

export const Default = Template.bind({});
