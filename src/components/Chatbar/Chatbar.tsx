import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMessagesOff, IconPlus, IconHome } from '@tabler/icons-react';

import { isEmpty } from 'src/utils/isEmpty';

const Chatbar = () => {
  const navigate = useNavigate();
  const [conversationCount, setConversationCount] = useState(
    isEmpty(JSON.parse(localStorage.getItem('conversationHistory')))
      ? []
      : JSON.parse(localStorage.getItem('conversationHistory'))
  );

  const gotoDashBoard = () => {
    navigate('/dashBoard');
  };

  const handlePlus = () => {
    conversationCount.push('1');
    localStorage.setItem(
      'conversationHistory',
      JSON.stringify(conversationCount)
    );
    setConversationCount([...conversationCount]);
  };

  const onDelete = (index) => {
    conversationCount.splice(index, 1);
    localStorage.setItem(
      'conversationHistory',
      JSON.stringify(conversationCount)
    );
    setConversationCount([...conversationCount]);
  };

  return (
    <div
      className={`fixed top-0 bottom-0 z-50 flex h-full w-1/6 flex-none flex-col space-y-2 bg-gray-800 p-4 transition-all sm:relative sm:top-0`}
    >
      <div>
        <button
          className="flex w-full gap-3 items-center cursor-pointer select-none rounded-md p-4 text-[14px] leading-normal bg-blue-400 text-white transition-colors duration-200 hover:bg-gray-500/10"
          onClick={() => gotoDashBoard()}
        >
          <IconHome size={18} />
          Admin Dash Board
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="flex border-b border-white/20 pb-2 pr-2">
          <div className="flex w-full flex-col ">
            <div className="flex flex-col gap-3 items-center text-sm leading-normal mt-8 text-white opacity-50">
              <IconMessagesOff />
              No Questions.
            </div>
            {/* {conversationCount.length > 0 ? (
              <div className="h-full">
                {conversationCount.map((item, index) => {
                  return (
                    <ChatConversation
                      index={index}
                      count={count}
                      click={handleClickConversation}
                      delete={onDelete}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center text-sm leading-normal mt-8 text-white opacity-50">
                <IconMessagesOff />
                No conversations.
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbar;
