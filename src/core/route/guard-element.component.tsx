import { Navigate, Outlet, useLocation, useSearch } from '@tanstack/react-router';

export type RouteGuard = () => boolean;

export interface GuardElementProps {
  useGuard: RouteGuard;
  redirectPath: string;
  sendPreviousPath?: boolean;
}

export const NEXT_PATH_PARAM_NAME = 'nextPath';

export const GuardElement = (props: GuardElementProps) => {
  const location = useLocation();
  const search = useSearch({ strict: false, structuralSharing: false }) as Record<string, unknown>;
  const authorized = props.useGuard();

  let targetUrl = search[NEXT_PATH_PARAM_NAME] as string | undefined;

  if (!targetUrl) {
    targetUrl = props.redirectPath;

    if (props.sendPreviousPath) {
      const searchParams = new URLSearchParams({
        nextPath:
          location.pathname + (location.search ? `?${new URLSearchParams(location.search as any).toString()}` : ''),
      });
      targetUrl += `?${searchParams.toString()}`;
    }
  }

  return authorized ? <Outlet /> : <Navigate to={targetUrl} />;
};
