import { Alert } from './Alert';
import { Button } from './Button';

export function PageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Alert tone="error">{message}</Alert>
      {onRetry ? (
        <div>
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
