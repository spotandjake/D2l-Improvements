import '../_Static/css/Theme/Dark.scss';
import '../_Static/css/Material.scss';
import '../_Static/css/Global.scss';
import { useEffect, useState } from 'react';

// Default App
const App = ({ Component, pageProps }) => {
  const [render, setRender] = useState(false);
  useEffect(() => setRender(true), []);
  return render ? <Component {...pageProps} /> : null;
};
export default App;
