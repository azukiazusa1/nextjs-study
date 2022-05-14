import { batchStories } from '@/utils/batchStories';

import * as stories from './User.stories';

describe('components/User', () => {
  batchStories(stories);
});
