import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
const socket = io("http://localhost:3001");

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentBotMessage, setCurrentBotMessage] = useState("");
  const botMessageRef = useRef("");
  const isInBoldSegment = useRef(false);
  const msgCardBodyRef = useRef(null);

  const formatBoldText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  };

  useEffect(() => {
    socket.on("botResponse", (data) => {
      if (isInBoldSegment.current) {
        botMessageRef.current += data;
        if (data.includes("**")) {
          botMessageRef.current = formatBoldText(botMessageRef.current);
          isInBoldSegment.current = false;
          setCurrentBotMessage(botMessageRef.current)
        }
      }
      else {
        if (data.includes("**")) {
          botMessageRef.current += data
          isInBoldSegment.current = true;
        }
        else {
          const formattedData = data.replace(/\n/g, "<br>");
          botMessageRef.current += formattedData;
          setCurrentBotMessage(botMessageRef.current);
        }
      }
    });

    return () => {
      socket.off("botResponse");
    };
  }, []);

  useEffect(() => {
    if (currentBotMessage) {
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const str_time = `${hour}:${minute}`;

      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.sender === "bot") {
          return prevMessages.slice(0, -1).concat({
            ...lastMessage,
            text: currentBotMessage,
          });
        } else {
          return prevMessages.concat({
            text: currentBotMessage,
            time: str_time,
            sender: "bot",
          });
        }
      });
    }
  }, [currentBotMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (msgCardBodyRef.current) {
      msgCardBodyRef.current.scrollTop = msgCardBodyRef.current.scrollHeight;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const str_time = `${hour}:${minute}`;

    const userMessage = {
      text: text,
      time: str_time,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    setText("");
    setCurrentBotMessage("");
    botMessageRef.current = "";
    socket.emit("message", text);
  };

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center h-100">
        <div className="col-md-8 col-xl-6 chat">
          <div className="card">
            <div className="card-header msg_head">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img
                    src="/images/logo.jpeg"
                    className="rounded-circle user_img"
                    alt="user"
                  />
                  <span className="online_icon"></span>
                </div>
                <div className="user_info">
                  <span>HSU ChatBot</span>
                  <p>Hãy hỏi tôi bất cứ thứ gì!</p>
                </div>
              </div>
            </div>
            <div id="messageFormeight" className="card-body msg_card_body" ref={msgCardBodyRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`d-flex justify-content-${message.sender === "user" ? "end" : "start"
                    } mb-4`}
                >
                  {message.sender === "bot" && (
                    <div className="img_cont_msg">
                      <img
                        src="https://i.ibb.co/fSNP7Rz/icons8-chatgpt-512.png"
                        className="rounded-circle user_img_msg"
                        alt="bot"
                      />
                    </div>
                  )}
                  <div
                    className={`msg_cotainer${message.sender === "user" ? "_send" : ""
                      }`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: message.text }} />
                    <span
                      className={`msg_time${message.sender === "user" ? "_send" : ""
                        }`}
                    >
                      {message.time}
                    </span>
                  </div>
                  {message.sender === "user" && (
                    <div className="img_cont_msg">
                      <img
                        src="https://i.ibb.co/d5b84Xw/Untitled-design.png"
                        className="rounded-circle user_img_msg"
                        alt="user"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="card-footer">
              <form
                id="messageArea"
                className="input-group"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  id="text"
                  name="msg"
                  placeholder="Type your message..."
                  autoComplete="off"
                  className="form-control type_msg"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <button
                    type="submit"
                    id="send"
                    className="input-group-text send_btn"
                  >
                    <i className="fas fa-location-arrow"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
