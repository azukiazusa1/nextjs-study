import { REQ_EVENTS, RES_EVENTS } from 'models/session';
import { useRouter } from 'next/router';
import React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';

import { SocketContext } from '@/context/socket';

import Avatar from '../Avatar/Avatar';

const avatarAltTexts = new Map([
  [1, '髭をはやしてオレンジ色の服を着ている男性'],
  [2, 'ショートヘアで赤い服を着ている女性'],
  [3, 'ちょび髭を生やした赤と黒のチェックシャツの男性'],
  [4, 'ミディアムヘアで緑の服を着ている女性'],
  [5, 'フラットデザインのキツネ'],
  [6, 'フラットデザインのペンギン'],
  [7, 'フラットデザインのアザラシ'],
  [8, 'フラットデザインのタコ'],
]);

const JoinRoomForm = () => {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const [defaultUsername, setDefaultUsername] = useState('');
  const [avatar, setAvatar] = useState('1');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = 'ring w-12 h-12 rounded-full ring-main';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = inputRef.current?.value;
    if (!username) {
      setHasError(true);
      return;
    }
    setHasError(false);

    const score = Number(localStorage.getItem('score') || 0);

    socket.emit(REQ_EVENTS.JOIN_ROOM, {
      score,
      username,
      avatar,
    });

    localStorage.setItem('username', username);
    localStorage.setItem('avatar', avatar);
  };

  useEffect(() => {
    socket.on(RES_EVENTS.JOINED, ({ roomId }: { roomId: string }) => {
      router.push(`/room/${roomId}`);
    });

    setDefaultUsername(localStorage.getItem('username') || '');
    setAvatar(localStorage.getItem('avatar') || '1');

    return () => {
      socket.off(RES_EVENTS.JOINED);
    };
  }, [router, socket]);

  return (
    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label" htmlFor="username">
              <span className="label-text">名前</span>
            </label>
            <input
              type="text"
              id="username"
              defaultValue={defaultUsername}
              ref={inputRef}
              className={`input input-bordered ${hasError ? 'border-red-500' : ''}`}
            />
            {hasError && (
              <p role="alert" className="font-medium text-red-500 text-xs mt-2">
                名前を入力してください
              </p>
            )}
          </div>
          <div className="grid mt-2 grid-cols-4 gap-4 place-items-center">
            {[...Array(8).keys()]
              .map((i) => ++i)
              .map((i) => (
                <button
                  type="button"
                  key={i}
                  className={`${avatar === String(i) && selected}`}
                  onClick={() => setAvatar(String(i))}
                >
                  <Avatar src={`/images/${i}.png`} alt={avatarAltTexts.get(i) || ''} />
                </button>
              ))}
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">JOIN👏</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomForm;
