import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Button from './Button';

export default {
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>ボタン</Button>;

export const Default = Template.bind({});

export const isLoading = Template.bind({});
isLoading.args = {
  loading: true,
};

export const isDisabled = Template.bind({});
isDisabled.args = {
  disabled: true,
};

export const isLink = Template.bind({});
isLink.args = {
  link: true,
};

export const isOutline = Template.bind({});
isOutline.args = {
  outline: true,
};

export const isActive = Template.bind({});
isActive.args = {
  active: true,
};

const Sizes: ComponentStory<typeof Button> = (args) => (
  <div className="grid grid-cols-6 gap-4">
    <Button {...args} size="xs">
      xs
    </Button>
    <Button {...args} size="sm">
      sm
    </Button>
    <Button {...args} size="md">
      md
    </Button>
    <Button {...args} size="lg">
      lg
    </Button>
  </div>
);

export const size = Sizes.bind({});

const Colors: ComponentStory<typeof Button> = (args) => (
  <div className="grid grid-cols-6 gap-4">
    <Button {...args} color="primary">
      primary
    </Button>
    <Button {...args} color="secondary">
      secondary
    </Button>
    <Button {...args} color="success">
      success
    </Button>
    <Button {...args} color="warning">
      warning
    </Button>
    <Button {...args} color="info">
      info
    </Button>
    <Button {...args} color="error">
      error
    </Button>
    <Button {...args} color="ghost">
      ghost
    </Button>
  </div>
);

export const color = Colors.bind({});
