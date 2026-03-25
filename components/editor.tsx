"use client";
import { useRef, useEffect } from "react";
import * as Y from "yjs";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodeEditor() {
  const editorRef = useRef(null);

  useEffect(() => {
    // Dynamically import y-websocket and y-monaco here
    async function initYjs() {
      try {
        const { WebsocketProvider } = await import("y-websocket");
        const { MonacoBinding } = await import("y-monaco");

        const yDocument = new Y.Doc();
        const provider = new WebsocketProvider(
          `${location.protocol === "http:" ? "ws:" : "wss:"}//localhost:1234`,
          "monaco",
          yDocument
        );

        // Debug WebSocket connection
        provider.on("status", event => {
          console.log(`WebSocket status: ${event.status}`); // connected/disconnected
        });

        const type = yDocument.getText("monaco");

        const monacoBinding = new MonacoBinding(
          type,
          editorRef.current!.getModel()!,
          new Set([editorRef.current!]),
          provider.awareness
        );

        // Debug Awareness
        provider.awareness.on("update", () => {
          console.log("Awareness updated:", provider.awareness.getStates());
        });
      } catch (error) {
        console.error("Failed to initialize Yjs or WebSocketProvider:", error);
      }
    }

    initYjs();
  }, []);

  function handleMount(editor, Monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value, event) {
    console.log("here is the current model value:", value);
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onChange={handleEditorChange}
      onMount={handleMount}
    />
  );
}
