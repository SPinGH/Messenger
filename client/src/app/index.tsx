import { useRoutes } from 'react-router-dom';
import { routes } from '@/pages';
import { withProviders } from './providers';

const App = withProviders(() => {
    const routing = useRoutes(routes);

    return routing;
});

export default App;
