import React from 'react';
import { createRoot } from 'react-dom/client';
import Contractor from './Contractor';

const path=window.location.pathname.replace(/\/+$/,'')||'/';
if(path==='/contratante'){
  createRoot(document.getElementById('root')).render(<Contractor/>);
}else{
  import('./main.jsx');
}
