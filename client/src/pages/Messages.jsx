import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import MessageService from "../services/MessageService";
import WebSocketService from "../services/WebSocketService";
import AuthService from "../services/AuthService";

export default function Messages() {
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);

  const [selectedUser, setSelectedUser] = useState(
    searchParams.get("email") || null
  );

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(selectedUser);

  const currentUser = AuthService.getUser();

  // =========================================================
  // KEEP SELECTED USER REF UPDATED
  // =========================================================

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // =========================================================
  // INITIAL LOAD + WEBSOCKET CONNECTION
  // =========================================================

  useEffect(() => {
    loadConversations();

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("JWT token not found");
      return;
    }

    WebSocketService.connect(
      token,

      // New real-time message received
      (newMessage) => {
        const activeUser =
          selectedUserRef.current;

        if (
          activeUser &&
          (newMessage.senderEmail === activeUser ||
            newMessage.receiverEmail === activeUser)
        ) {
          setMessages((previousMessages) => {
            const alreadyExists =
              previousMessages.some(
                (message) =>
                  message.id === newMessage.id
              );

            if (alreadyExists) {
              return previousMessages;
            }

            return [
              ...previousMessages,
              newMessage,
            ];
          });

          // If message came from the currently open
          // conversation, mark it as read immediately
          if (
            newMessage.senderEmail === activeUser
          ) {
            MessageService.markAsRead(
              activeUser
            )
              .then(() => {
                window.dispatchEvent(
                  new Event("messages-read")
                );
              })
              .catch((error) => {
                console.error(
                  "Failed to mark incoming message as read:",
                  error
                );
              });
          }
        } else {
          // A message arrived from another conversation.
          // Tell Sidebar to refresh unread count.
          window.dispatchEvent(
            new Event("messages-updated")
          );
        }

        // Refresh conversation list
        loadConversations();
      },

      () => {
        setConnected(true);
      },

      (error) => {
        console.error(
          "WebSocket connection failed:",
          error
        );

        setConnected(false);
      }
    );

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  // =========================================================
  // LOAD CONVERSATION WHEN USER CHANGES
  // =========================================================

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    loadConversation(selectedUser);
  }, [selectedUser]);

  // =========================================================
  // AUTO SCROLL
  // =========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================================================
  // LOAD CONVERSATIONS
  // =========================================================

  async function loadConversations() {
    try {
      const data =
        await MessageService.getConversations();

      let users =
        Array.isArray(data) ? data : [];

      // If page was opened directly from profile:
      // /messages?email=user@email.com
      const queryEmail =
        searchParams.get("email");

      if (
        queryEmail &&
        !users.includes(queryEmail)
      ) {
        users = [
          queryEmail,
          ...users,
        ];
      }

      setConversations(users);

      // Automatically select first conversation
      // only when nothing is currently selected
      if (
        !selectedUserRef.current &&
        users.length > 0
      ) {
        setSelectedUser(users[0]);
      }
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error
      );
    } finally {
      setLoadingConversations(false);
    }
  }

  // =========================================================
  // LOAD MESSAGE HISTORY
  // =========================================================

  async function loadConversation(email) {
    try {
      setLoadingMessages(true);

      const data =
        await MessageService.getConversation(
          email
        );

      setMessages(
        Array.isArray(data) ? data : []
      );

      // Mark messages from this user as read
      await MessageService.markAsRead(
        email
      );

      // Tell Sidebar to refresh unread count
      window.dispatchEvent(
        new Event("messages-read")
      );
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  function handleSendMessage() {
    const content =
      messageText.trim();

    if (!content || !selectedUser) {
      return;
    }

    if (!WebSocketService.isConnected()) {
      alert(
        "Messaging connection is not ready yet. Please wait a moment."
      );

      return;
    }

    const sent =
      WebSocketService.sendMessage(
        selectedUser,
        content
      );

    if (sent) {
      setMessageText("");
    }
  }

  // =========================================================
  // ENTER KEY
  // =========================================================

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSendMessage();
    }
  }

  // =========================================================
  // DISPLAY NAME
  // =========================================================

  function getDisplayName(email) {
    if (!email) {
      return "";
    }

    return email.split("@")[0];
  }

  function getInitial(email) {
    if (!email) {
      return "?";
    }

    return email
      .charAt(0)
      .toUpperCase();
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <DashboardLayout>
      <div className="p-6 h-[calc(100vh-5rem)]">

        <div className="bg-white border rounded-2xl shadow-sm h-full flex overflow-hidden">

          {/* ================================================= */}
          {/* LEFT SIDEBAR */}
          {/* ================================================= */}

          <div className="w-80 border-r flex flex-col">

            <div className="p-5 border-b">

              <div className="flex items-center gap-3">

                <MessageCircle
                  size={25}
                  className="text-blue-600"
                />

                <div>

                  <h1 className="text-xl font-bold text-slate-800">
                    Messages
                  </h1>

                  <p className="text-xs text-slate-500 mt-1">
                    {connected
                      ? "Connected"
                      : "Connecting..."}
                  </p>

                </div>

              </div>

            </div>

            <div className="flex-1 overflow-y-auto">

              {loadingConversations ? (

                <p className="p-5 text-sm text-gray-500">
                  Loading conversations...
                </p>

              ) : conversations.length === 0 ? (

                <div className="p-5 text-sm text-gray-500">
                  No conversations yet.
                </div>

              ) : (

                conversations.map(
                  (email) => (

                    <button
                      key={email}
                      type="button"
                      onClick={() =>
                        setSelectedUser(email)
                      }
                      className={`w-full flex items-center gap-3 p-4 border-b text-left transition ${
                        selectedUser === email
                          ? "bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                    >

                      <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                        {getInitial(email)}
                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-slate-800 truncate">
                          {getDisplayName(
                            email
                          )}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {email}
                        </p>

                      </div>

                    </button>

                  )
                )

              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* RIGHT CHAT */}
          {/* ================================================= */}

          <div className="flex-1 flex flex-col min-w-0">

            {!selectedUser ? (

              // EMPTY STATE

              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">

                <MessageCircle
                  size={65}
                  strokeWidth={1.3}
                />

                <h2 className="mt-4 text-xl font-semibold text-gray-600">
                  Select a conversation
                </h2>

                <p className="mt-2 text-sm">
                  Choose someone to start chatting.
                </p>

              </div>

            ) : (

              <>

                {/* =========================================== */}
                {/* CHAT HEADER */}
                {/* =========================================== */}

                <div className="h-20 border-b px-6 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="h-11 w-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">

                      {getInitial(
                        selectedUser
                      )}

                    </div>

                    <div>

                      <h2 className="font-semibold text-slate-800">

                        {getDisplayName(
                          selectedUser
                        )}

                      </h2>

                      <p className="text-xs text-slate-500">
                        {selectedUser}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      connected
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >

                    {connected
                      ? "Live"
                      : "Connecting"}

                  </span>

                </div>

                {/* =========================================== */}
                {/* MESSAGES */}
                {/* =========================================== */}

                <div className="flex-1 overflow-y-auto bg-slate-50 p-6">

                  {loadingMessages ? (

                    <p className="text-center text-gray-500">
                      Loading messages...
                    </p>

                  ) : messages.length === 0 ? (

                    <div className="h-full flex items-center justify-center">

                      <p className="text-gray-400">
                        No messages yet. Say hello 👋
                      </p>

                    </div>

                  ) : (

                    <div className="space-y-4">

                      {messages.map(
                        (message) => {

                          const isMine =
                            message.senderEmail ===
                            currentUser?.email;

                          return (

                            <div
                              key={message.id}
                              className={`flex ${
                                isMine
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >

                              <div
                                className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                                  isMine
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "bg-white border text-slate-800 rounded-bl-md"
                                }`}
                              >

                                <p className="whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>

                                {message.createdAt && (

                                  <p
                                    className={`text-[10px] mt-2 ${
                                      isMine
                                        ? "text-blue-100"
                                        : "text-gray-400"
                                    }`}
                                  >

                                    {new Date(
                                      message.createdAt
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute:
                                          "2-digit",
                                      }
                                    )}

                                  </p>

                                )}

                              </div>

                            </div>

                          );
                        }
                      )}

                      <div
                        ref={messagesEndRef}
                      />

                    </div>

                  )}

                </div>

                {/* =========================================== */}
                {/* MESSAGE INPUT */}
                {/* =========================================== */}

                <div className="border-t bg-white p-4">

                  <div className="flex items-end gap-3">

                    <textarea
                      value={messageText}
                      onChange={(event) =>
                        setMessageText(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      rows={1}
                      placeholder="Type a message..."
                      className="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={
                        handleSendMessage
                      }
                      disabled={
                        !messageText.trim() ||
                        !connected
                      }
                      className="h-12 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition"
                    >

                      <Send size={20} />

                    </button>

                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Press Enter to send · Shift + Enter for new line
                  </p>

                </div>

              </>

            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}