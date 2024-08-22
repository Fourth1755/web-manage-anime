import { configureStore } from '@reduxjs/toolkit'
import animeReducer from './features/animes/animesSlice'
import counter from './features/counter/counterSlice'

// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//       animeReducer,
//       counter
//     },
//   })
// }
export const store = configureStore({
  reducer:{
    animeReducer,
    counter
  }
})

// Infer the type of makeStore
//export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch