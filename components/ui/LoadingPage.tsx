interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message }: LoadingPageProps) {
  return (
    <div className="page">
      <div className="container">
        <p className="text-slate-700">{message}</p>
      </div>
    </div>
  );
}
