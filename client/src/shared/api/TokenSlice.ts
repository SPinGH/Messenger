import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Token {
    token: string;
}

interface TokenState {
    accessToken: string | null;
}

const initialState: TokenState = {
    accessToken: localStorage.getItem('accessToken'),
};

export const TokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<Token>) => {
            state.accessToken = action.payload.token;
        },
        clearToken: (state) => {
            state.accessToken = null;
        },
    },
});

export const setToken = (tokens: Token) => (dispatch: AppDispatch) => {
    dispatch(TokenSlice.actions.setToken(tokens));

    localStorage.setItem('accessToken', tokens.token);
};

export const clearToken = () => (dispatch: AppDispatch) => {
    dispatch(TokenSlice.actions.clearToken());

    localStorage.removeItem('accessToken');
};

export default TokenSlice.reducer;
