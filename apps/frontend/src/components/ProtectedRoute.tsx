import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@repo/store/useUser';
import { Loader } from './Loader';
import { Suspense } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps a route that requires authentication.
 *
 * Works for ALL users (OAuth, email, guest) because guest users are real
 * DB users — the backend issues them a JWT cookie via POST /auth/guest,
 * and /auth/refresh validates it the same way as any other session.
 *
 * - user !== null → render children
 * - user === null → redirect to /login, preserving the intended path
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useUser();
  const location = useLocation();

  if (user) return <>{children}</>;

  return <Navigate to="/login" state={{ from: location }} replace />;
}

/** Keeps the Suspense boundary for the async userAtom selector */
export function ProtectedRouteWithSuspense(props: ProtectedRouteProps) {
  return (
    <Suspense fallback={<Loader />}>
      <ProtectedRoute {...props} />
    </Suspense>
  );
}

export default ProtectedRoute;
