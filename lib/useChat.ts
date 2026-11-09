"use client";

import { useState, useCallback, useRef } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
}

export interface UseChatOptions {
  api?: string;
  body?: Record<string, unknown>;
  onError?: (error: Error) => void;
  initialMessages?: Message[];
}

export function useChat(options: UseChatOptions = {}) {
  const { api = "/api/chat", body = {}, onError, initialMessages = [] } = options;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bodyRef = useRef(body);
  bodyRef.current = body;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }) => {
      setInput(e.target.value);
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string, currentMessages: Message[]) => {
      if (!text.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        createdAt: new Date(),
      };

      const newMessages = [...currentMessages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
            ...bodyRef.current,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `Request failed with status ${res.status}`);
        }

        if (!res.body) {
          throw new Error("No response body received from chat API");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
        const assistantMessageId = (Date.now() + 1).toString();

        setMessages(prev => [
          ...prev,
          { id: assistantMessageId, role: "assistant", content: "", createdAt: new Date() },
        ]);

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            if (line.startsWith("0:")) {
              try {
                const parsed = JSON.parse(line.slice(2));
                assistantText += parsed;
              } catch {
                assistantText += line.slice(2);
              }
            } else {
              try {
                if (line.startsWith('"') && line.endsWith('"')) {
                  assistantText += JSON.parse(line);
                } else {
                  assistantText += line;
                }
              } catch {
                assistantText += line;
              }
            }

            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId ? { ...msg, content: assistantText } : msg
              )
            );
          }
        }

        if (buffer.trim()) {
          if (buffer.startsWith("0:")) {
            try {
              assistantText += JSON.parse(buffer.slice(2));
            } catch {
              assistantText += buffer.slice(2);
            }
          } else {
            assistantText += buffer;
          }
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId ? { ...msg, content: assistantText } : msg
            )
          );
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("useChat error:", error);
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [api, onError]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }
      if (!input.trim() || isLoading) return;

      const currentInput = input;
      setInput("");
      sendMessage(currentInput, messages);
    },
    [input, isLoading, messages, sendMessage]
  );

  const append = useCallback(
    async (message: { role: string; content: string }) => {
      await sendMessage(message.content, messages);
      return message.content;
    },
    [messages, sendMessage]
  );

  return {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
  };
}
