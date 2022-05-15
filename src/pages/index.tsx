import type { NextPage } from 'next';
import Head from 'next/head';

import JoinRoomForm from '@/components/JoinRoomForm/JoinRoomForm';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ポモドーロセッション</title>
      </Head>
      <main>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col max-w-xl">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">さあ、みんなではじめよう</h1>
              <p className="py-6">
                最大4人で集まって、みんなでポモドーロ・テクニックを開始しましょう。
              </p>
            </div>
            <JoinRoomForm />
            <div>
              <p className="py-3">
                ポモドーロ・テクニックを始めてみたいけど一人ではこっそりサボってしまうかも・・・😢
              </p>
              <p className="py-3">
                実は作業に取り組むときに、自分ひとりよりも周囲に誰かがいる状況のほうが捗ることが知られています。ポモドーロ・テクニックもみんなで初めると効果的です👍
              </p>
              <p className="py-3">さぁ、名前とアバターを入力して、いますぐ始めてみましょう！</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
