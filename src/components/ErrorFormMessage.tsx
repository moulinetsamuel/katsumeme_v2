interface ErrorFormMessageProps {
  message?: string;
}

export function ErrorFormMessage({ message }: ErrorFormMessageProps) {
  if (!message) return null;
  return <p className="text-red-500 text-sm">{message}</p>;
}
