import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>You are offline</h1>
      <p>Please check your connection and try again.</p>
      <Link href="/">Go back to home</Link>
    </div>
  );
}
