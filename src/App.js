import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store'
import Members from './components/Members';

axios.defaults.baseURL = 'https://geektrust.s3-ap-southeast-1.amazonaws.com';


function App() {

  return (
    <Provider store={store}>
      <div>
        <CssBaseline />
        <Members />
      </div>
    </Provider>
  )
}

export default App
