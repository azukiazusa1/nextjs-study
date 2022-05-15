import { composeStories } from '@storybook/testing-react';
import { StoryFile } from '@storybook/testing-react/dist/types';
import { render } from '@testing-library/react';
import React from 'react';

export const batchStories = (stories: StoryFile) => {
  const testCases = Object.values(composeStories(stories)).map((Story: any) => [
    Story.storyName,
    Story,
  ]);

  test.each(testCases)('Renders %s story', async (_storyName, Story) => {
    const tree = await render(<Story />);
    expect(tree.baseElement).toMatchSnapshot();
  });
};
