import React from 'react';

const SkeltonUser: React.FC = () => {
  return (
    <div className="animate-pulse flex max-w-60">
      <div className="rounded-full bg-slate-700 h-12 w-12" />
      <div className="flex-1 space-y-4 mt-2 ml-4">
        <div className="h-2 bg-slate-700 rounded" />
        <div className="h-2 bg-slate-700 rounded" />
      </div>
    </div>
  );
};

export default SkeltonUser;
