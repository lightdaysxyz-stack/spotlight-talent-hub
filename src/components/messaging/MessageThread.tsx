import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BrutalButton } from "@/components/brutal/BrutalButton";

interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

interface Props {
  applicationId: string;
  /** Other participant's display name, used for empty-state copy */
  counterpartName?: string;
}

export const MessageThread = ({ applicationId, counterpartName }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("messages")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          toast({ title: "Couldn't load messages", description: error.message, variant: "destructive" });
        } else {
          setMessages((data as Message[]) ?? []);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId, toast]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${applicationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `application_id=eq.${applicationId}`,
        },
        (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => (prev.find((x) => x.id === m.id) ? prev : [...prev, m]));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicationId]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || !user) return;
    setSending(true);
    const { data, error } = await supabase
      .from("messages")
      .insert({ application_id: applicationId, sender_id: user.id, body: text })
      .select()
      .single();
    setSending(false);
    if (error) {
      toast({ title: "Send failed", description: error.message, variant: "destructive" });
      return;
    }
    setBody("");
    if (data) {
      setMessages((prev) => (prev.find((x) => x.id === (data as Message).id) ? prev : [...prev, data as Message]));
    }
  };

  return (
    <div className="border-[3px] border-foreground bg-background flex flex-col h-[360px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="text-center font-mono text-xs opacity-60 py-8 animate-pulse">Loading thread…</div>
        ) : messages.length === 0 ? (
          <div className="text-center font-mono text-xs opacity-60 py-8">
            No messages yet. Say hi to {counterpartName || "the other side"} ✦
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 border-[3px] border-foreground font-mono text-sm whitespace-pre-wrap break-words ${
                    mine ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  {m.body}
                  <div className="text-[10px] opacity-60 mt-1">
                    {new Date(m.created_at).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={send} className="border-t-[3px] border-foreground p-2 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 h-10 px-3 bg-background border-[3px] border-foreground font-mono text-sm focus:outline-none focus:bg-secondary/30"
          maxLength={2000}
          disabled={sending}
        />
        <BrutalButton type="submit" variant="primary" size="md" disabled={sending || !body.trim()}>
          <Send size={16} /> Send
        </BrutalButton>
      </form>
    </div>
  );
};
