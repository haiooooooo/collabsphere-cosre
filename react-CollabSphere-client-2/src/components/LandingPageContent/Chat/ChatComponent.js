import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  MessageInput,
  VirtualizedMessageList,
  Thread,
  Window
} from "stream-chat-react";
import { MDBContainer } from "mdb-react-ui-kit";

import './Chat.css'
import "stream-chat-react/dist/css/index.css";

const userToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoibGl0dGxlLXdvb2QtOSJ9.CqE75Jdcw_Gv2CySKWsgkGd2ECVe7dR3_Knxap5mlZg";

const filters = { type: "messaging", members: { $in: ["little-wood-9"] } };
const sort = { last_message_at: -1 };

const ChatComponent = () => {
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance("t442dfkucxcj");

      await client.connectUser(
        {
          id: "little-wood-9",
          name: "little-wood-9",
          image:
            "https://getstream.io/random_png/?id=little-wood-9&name=little-wood-9"
        },
        userToken
      );

      setChatClient(client);
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
 
    <Chat client={chatClient}>
      <ChannelList filters={filters} sort={sort} />
      <Channel>
        <Window>
          <ChannelHeader />
          <VirtualizedMessageList
            additionalVirtuosoProps={{
              increaseViewportBy: { top: 400, bottom: 200 }
            }}
          />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>

  );
};

export default ChatComponent;

