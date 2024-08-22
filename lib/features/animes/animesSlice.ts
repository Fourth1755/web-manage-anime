import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

interface AnimesState {
  animes: [],
  currentAnime: null,
  loading: false,
  error: null,
}

// Define the initial state using that type
const initialState: AnimesState = {
  animes: [],
  currentAnime: null,
  loading: false,
  error: null,
}

const apiUrl = 'https://669630670312447373c173cf.mockapi.io/animap/animes';

export const fetchAnimes = createAsyncThunk("animes/fetchAnimes", async () => {
  const response = await axios.get(apiUrl);
  return response.data;
});

export const animeSlice = createSlice({
  name: 'anime',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAnimes.fulfilled,(state,action)=>{
      state.animes = action.payload
    })
  },
})

//export const { fetchAnimes } = animeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export default animeSlice.reducer