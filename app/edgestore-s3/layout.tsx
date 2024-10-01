import { EdgeStoreProvider } from '@/utils/edgestore-s3';

export default function EdgestoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EdgeStoreProvider basePath='/api/edgestore-s3'>
          {children}
        </EdgeStoreProvider>
      </body>
    </html>
  );
}