import React, { useEffect, useState } from "react";
import "./Messages.css";
import Sidebar from "../Sidebar/Sidebar";
import SearchToChat from "./Search/SearchToChat";
import { useDispatch, useSelector } from "react-redux";
import { getAllChatsThunk } from "../../Redux/chatSlice";
import { getSenderName, getSenderUserName } from "../../Config/Helper";
import {
  getAllMessagesThunk,
  sendMessageThunk,
} from "../../Redux/messageSlice";
import { ToastContainer, toast } from "react-toastify";
import ScrollableChatFeeds from "./ScrollableChatFeeds";
import emoji from "../../Assets/emoji.svg";
import EmojiPicker from "emoji-picker-react";

const Messages = () => {
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [selectedChat, setSelectedChat] = useState(null);
  const [content, setContent] = useState("");
  const [chats, setChats] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onClickEmoji = (object, e) => {
    setContent((prevText) => prevText + object.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    dispatch(getAllChatsThunk())
      .then((res) => {
        // console.log(res);
        setChats(res.payload.data.USER);

        // console.log(res.payload.data.USERS);
        // console.log(chats);
        return res;
      })
      .catch((err) => {
        // console.log(err);
        return err.response;
      });
  }, []);
  const msg = useSelector((state) => state.message);

  useEffect(() => {
    if (msg.isSuccess) {
      setAllMessages(msg.messagesArray);
      // setMessageToSend("");
      // socket.emit("join a chat", chatid);

      // setLoading(false);
    }
  }, [msg]);
  const userData = {
    content: content,
    chatId: selectedChat ? selectedChat._id : "",
  };

  const userData2 = {
    chatId: selectedChat ? selectedChat._id : "",
  };

  const handleSend = (e) => {
    if (selectedChat && e.key === "Enter") {
      if (!content) {
        toast.error("Enter some text to send", {
          position: "top-right",
          theme: "dark",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      dispatch(sendMessageThunk(userData))
        .then((res) => {
          console.log(res);
          if (res.payload.data.success) {
            toast.success(`${res.payload.data.msg}`, {
              position: "top-right",
              theme: "dark",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            setContent("");
          } else {
            toast.error(`${"unable to send the message"}`, {
              position: "top-right",
              theme: "DARK",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
          return res;
        })

        .catch((err) => {
          console.log(err);
          return err.response;
        });
    }
  };

  useEffect(() => {
    if (selectedChat) {
      dispatch(getAllMessagesThunk(userData2.chatId))
        .then((res) => {
          // console.log(res);
          return res;
        })
        .catch((err) => {
          // console.log(err);
          return err.response;
        });
    }
  });
  return (
    <>
      <div className="message-page">
        <Sidebar />
        <div className="message-box-body">
          <div className="message-box">
            {selectedChat ? (
              <>
                <div className="chat-box">
                  <p className="sender-heading">
                    {getSenderName(user, selectedChat.users)}
                  </p>
                  <div className="messages">
                    <ScrollableChatFeeds allMessages={allMessages} />
                  </div>
                  <div className="send-input-msg">
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="input-msg"
                      placeholder="Enter a message"
                      onKeyDown={handleSend}
                    />
                    <img
                      src={emoji}
                      alt=""
                      onClick={toggleEmojiPicker}
                      className="emoji-img emoji-icon emojii"
                    />
                    {showEmojiPicker ? (
                      <div className="emojipicker11">
                        <EmojiPicker
                          theme="dark"
                          width="20vw"
                          height="300px"
                          onEmojiClick={onClickEmoji}
                        />
                      </div>
                    ) : null}
                    {/* <button onClick={handleSend}> */}
                    {/* <img src={sendImg} alt="" className="send-img" /> */}
                    {/* send */}
                    {/* </button> */}
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="chat-text">Click on a user to start chatting</p>
              </>
            )}
            {/* 
            <div className="send-input-msg">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-msg"
                placeholder="Enter a message"
              />
              <img
                src={sendImg}
                alt=""
                className="send-img"
                onClick={handleSend}
              />
            </div> */}
          </div>
        </div>
        <div className="search-users-messages">
          <SearchToChat />
          <h1
            style={{
              textAlign: "center",
            }}
          >
            MY CHATS
          </h1>
          {chats &&
            chats.map((chat) => {
              return (
                <>
                  <div className="all-chats" key={chat._id}>
                    <div
                      className="all-chat"
                      style={{
                        backgroundColor: `${
                          selectedChat === chat ? "#494fde" : "indianred"
                        }`,
                      }}
                      bgcolor={selectedChat === chat ? "#494fde" : "#fafcfc"}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <p className="sender">
                        {getSenderName(user, chat.users)}
                      </p>

                      <p className="sender-username">
                        @{getSenderUserName(user, chat.users)}
                      </p>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Messages;
