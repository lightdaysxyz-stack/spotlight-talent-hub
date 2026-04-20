CREATE POLICY "Directors view auditions for their roles"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'auditions'
  AND EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.roles r ON r.id = a.role_id
    WHERE r.director_id = auth.uid()
      AND a.video_url = storage.objects.name
  )
);