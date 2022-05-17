import React from 'react';

import useMessages from '@/hooks/useMessages';

const EmojiPicker = () => {
  const { sendMessage } = useMessages();

  return (
    <div className="btn-group">
      <button className="btn btn-circle" onClick={() => sendMessage('👍')}>
        👍
      </button>
      <button className="btn btn-circle" onClick={() => sendMessage('❤️')}>
        ❤️
      </button>
      <button className="btn btn-circle" onClick={() => sendMessage('😆')}>
        😆
      </button>
      <button className="btn btn-circle" onClick={() => sendMessage('👏')}>
        👏
      </button>
      <button className="btn btn-circle" onClick={() => sendMessage('🦀')}>
        🦀
      </button>
    </div>
  );
};

export default EmojiPicker;
