import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8080/ws";

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  // =========================================================
  // CONNECT
  // =========================================================

  connect(token, onMessage, onConnected, onError) {
    if (this.client?.active) {
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log("WebSocket connected");

        this.connected = true;

        // Private messages for logged-in user
        this.client.subscribe(
          "/user/queue/messages",
          (message) => {
            try {
              const receivedMessage = JSON.parse(
                message.body
              );

              if (onMessage) {
                onMessage(receivedMessage);
              }
            } catch (error) {
              console.error(
                "Failed to parse WebSocket message:",
                error
              );
            }
          }
        );

        if (onConnected) {
          onConnected();
        }
      },

      onStompError: (frame) => {
        console.error(
          "STOMP error:",
          frame.headers["message"]
        );

        console.error(
          "Details:",
          frame.body
        );

        if (onError) {
          onError(frame);
        }
      },

      onWebSocketError: (error) => {
        console.error(
          "WebSocket error:",
          error
        );

        if (onError) {
          onError(error);
        }
      },

      onDisconnect: () => {
        console.log("WebSocket disconnected");
        this.connected = false;
      },

      debug: (message) => {
        console.log("STOMP:", message);
      },
    });

    this.client.activate();
  }

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  sendMessage(receiverEmail, content, taskId = null) {
    if (!this.client || !this.connected) {
      console.error(
        "Cannot send message: WebSocket is not connected"
      );

      return false;
    }

    const message = {
      receiverEmail,
      content,
      taskId,
    };

    this.client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });

    return true;
  }

  // =========================================================
  // CHECK CONNECTION
  // =========================================================

  isConnected() {
    return this.connected;
  }

  // =========================================================
  // DISCONNECT
  // =========================================================

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
    }
  }
}

export default new WebSocketService();