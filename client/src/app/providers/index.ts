import { compose } from '@/shared/lib';

import { withMantineConfig } from './withMantineConfig';
import { withErrorBoundary } from './withErrorBoundary';
import { withRouter } from './withRouter';
import { withStore } from './withStore';

export const withProviders = compose(withErrorBoundary, withMantineConfig, withStore, withRouter);
