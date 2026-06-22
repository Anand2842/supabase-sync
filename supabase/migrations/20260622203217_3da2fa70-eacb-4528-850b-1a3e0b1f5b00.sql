CREATE TABLE public.pending_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'mcp',
  client_label text,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  decided_by uuid REFERENCES auth.users(id),
  decided_at timestamptz,
  apply_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pending_changes_status_chk CHECK (status IN ('pending','approved','rejected','applied','failed')),
  CONSTRAINT pending_changes_action_chk CHECK (action IN ('create','update','delete','reorder'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pending_changes TO authenticated;
GRANT ALL ON public.pending_changes TO service_role;

ALTER TABLE public.pending_changes ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admin dashboard is auth-gated) can read/update pending changes.
CREATE POLICY "Authenticated read pending_changes"
  ON public.pending_changes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated update pending_changes"
  ON public.pending_changes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER pending_changes_set_updated_at
  BEFORE UPDATE ON public.pending_changes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX pending_changes_status_created_idx
  ON public.pending_changes(status, created_at DESC);