import { useNavigate, useSearch } from '@tanstack/react-router';
import { NEXT_PATH_PARAM_NAME } from './guard-element.component';

interface UseNavigateToNextRouteParams {
  fallbackRoute: string;
}

export const useNavigateToNextRoute = ({ fallbackRoute }: UseNavigateToNextRouteParams = { fallbackRoute: '/' }) => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false, structuralSharing: false }) as Record<string, unknown>;

  const navigateToNextRoute = () => {
    const nextPath = search[NEXT_PATH_PARAM_NAME] as string | undefined;

    if (!nextPath) {
      navigate({ to: fallbackRoute });
      return;
    }

    navigate({ to: nextPath });
  };

  return { navigateToNextRoute };
};
