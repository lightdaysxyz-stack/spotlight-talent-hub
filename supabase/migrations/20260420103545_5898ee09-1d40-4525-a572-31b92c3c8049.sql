-- Messages table for director <-> applicant threads
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_application ON public.messages(application_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper: is current user a participant in this application's thread?
CREATE OR REPLACE FUNCTION public.is_thread_participant(_application_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.roles r ON r.id = a.role_id
    WHERE a.id = _application_id
      AND (a.model_id = _user_id OR r.director_id = _user_id)
  );
$$;

CREATE POLICY "Participants view thread messages"
ON public.messages
FOR SELECT
TO authenticated
USING (public.is_thread_participant(application_id, auth.uid()));

CREATE POLICY "Participants send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND public.is_thread_participant(application_id, auth.uid())
);

CREATE POLICY "Senders update own messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid());

CREATE POLICY "Senders delete own messages"
ON public.messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid());

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;