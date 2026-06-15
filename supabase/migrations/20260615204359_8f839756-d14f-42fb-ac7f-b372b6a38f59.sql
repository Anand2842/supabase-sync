
-- anyone (anon or authenticated) may list/download from the portfolio-images bucket
CREATE POLICY "portfolio-images public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

-- only authenticated (admin) may write
CREATE POLICY "portfolio-images authed insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "portfolio-images authed update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images')
WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "portfolio-images authed delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');
