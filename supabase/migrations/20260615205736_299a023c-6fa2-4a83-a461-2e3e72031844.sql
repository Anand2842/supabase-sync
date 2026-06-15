
-- Anyone can read objects in the portfolio-images bucket (needed to load the
-- state.json sidecar and signed image URLs for unauthenticated visitors).
DROP POLICY IF EXISTS "portfolio-images public read" ON storage.objects;
CREATE POLICY "portfolio-images public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-images');

-- Only signed-in admins can write/replace/delete the assets.
DROP POLICY IF EXISTS "portfolio-images admin write" ON storage.objects;
CREATE POLICY "portfolio-images admin write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "portfolio-images admin update" ON storage.objects;
CREATE POLICY "portfolio-images admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-images')
  WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "portfolio-images admin delete" ON storage.objects;
CREATE POLICY "portfolio-images admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-images');
