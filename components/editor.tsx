"use client";
import { useRef, useEffect, useState } from "react";
import * as Y from "yjs";
import dynamic from "next/dynamic";
import { editor } from "monaco-editor";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodeEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const [isEditorReady, setEditorReady] = useState(false);

  async function initYjs(): Promise<void> {
    try {
      const { WebsocketProvider } = await import("y-websocket");
      const { MonacoBinding } = await import("y-monaco");

      const yDocument = new Y.Doc();
      const provider = new WebsocketProvider(
        `${location.protocol === "http:" ? "ws:" : "wss:"}//localhost:1234`,
        "monaco",
        yDocument,
      );
      // Debug WebSocket connection
      provider.on("status", (event: { status: string }) => {
        console.log(`WebSocket status: ${event.status}`); // connected/disconnected
      });

      const type = yDocument.getText("monaco");

      const monacoBinding = new MonacoBinding(
        type,
        editorRef.current!.getModel()!,
        new Set([editorRef.current!]),
        provider.awareness,
      );

      // Debug Awareness
      provider.awareness.on("update", () => {
        console.log("Awareness updated", provider.awareness.getStates());
      });
    } catch (error) {
      console.error("Error during Yjs initialization:", error);
    }
  }
  useEffect(() => {
    if (isEditorReady) {
      initYjs();
    }
    console.log("Yjs initialization triggered");
  }, [isEditorReady]);

  function handleMount(editor: editor.IStandaloneCodeEditor, Monaco: any) {
    console.log("Editor mounted:", editor);
    editorRef.current = editor;
    setEditorReady(true);
  }

  function handleEditorChange(value: string, event: any) {
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
