import React, { useState, useEffect } from "react";

const IframePage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receiveMessage = event => {
      // Ensure messages are received from same-origin
      if (event.origin !== window.location.origin) return;
      const receivedMsg = event.data;
      setMessages(prevMessages => [
        ...prevMessages,
        `Received from parent: ${receivedMsg}`,
      ]);
    };

    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  const sendMessage = () => {
    // Send a message back to the parent
    const replyMsg = `from iframe @${new Date().getTime()}`;
    setMessages(prevMessages => [...prevMessages, `Sent: ${replyMsg}`]);
    window.parent.postMessage(replyMsg, window.location.origin); // specify target origin
  };

  return (
    <div>
      <p>This is the Iframe Page</p>
      <button onClick={sendMessage}>Send Message</button>
      <pre style={{ margin: "1rem" }}>{messages.join("\n")}</pre>
    </div>
  );
};

export default IframePage;
