import { FC } from 'react';
import { Provider } from 'react-redux';

import { createStore } from '../store';

const store = createStore();

export const withStore =
    (Component: FC): FC =>
    () =>
        (
            <Provider store={store}>
                <Component />
            </Provider>
        );
