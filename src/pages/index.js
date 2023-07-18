import React, { useRef, useState, useEffect } from "react";

const ParentPage = () => {
  const iframeRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receiveMessage = event => {
      // Ensure messages are received from same-origin
      if (event.origin !== window.location.origin) return;
      setMessages(prevMessages => [
        ...prevMessages,
        `Received from iframe: ${event.data}`,
      ]);
    };

    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  const sendMessage = () => {
    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;
    const message = `from parent @${new Date().getTime()}`;
    setMessages(prevMessages => [...prevMessages, `Sent: ${message}`]);
    iframeWindow.postMessage(message, window.location.origin); // specify target origin
  };

  return (
    <div>
      <iframe
        src="/iframe"
        ref={iframeRef}
        title="Iframe Page"
        style={{ width: "calc(100% - 2rem)", height: 200, margin: "1rem" }}
      ></iframe>
      <button onClick={sendMessage}>Send Message</button>
      <pre style={{ margin: "1rem" }}>{messages.join("\n")}</pre>
    </div>
  );
};

export default ParentPage;
