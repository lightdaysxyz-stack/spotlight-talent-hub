import { Navigate, useLocation } from "react-router-dom";
import { useAuth, AppRole } from "@/hooks/useAuth";

export const RequireAuth = ({
  children,
  role,
}: {
  children: JSX.Element;
  role?: AppRole;
}) => {
  const { user, role: userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="font-display text-2xl uppercase animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && userRole !== role) {
    const correct = userRole === "director" ? "/dashboard/director" : "/dashboard/model";
    return <Navigate to={correct} replace />;
  }

  return children;
};
