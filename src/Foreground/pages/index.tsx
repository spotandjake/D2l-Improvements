import React, { useState } from 'react';
import Head from 'next/head';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrightSpace from '../_Static/Classes/BrightSpaceApi';
// Import Views
import ClassList from '../_Static/Views/ClassList';
import ClassRoom from '../_Static/Views/ClassRoom';
import NavBar from '../_Static/Components/NavBar';
import Aside from '../_Static/Components/Aside';
// Application
const Application = () => {
  const [pageTitle, setPageTitle] = useState('Homepage - ClassList');
  const [_showAside, setShowAside] = useState(false);
  const [_searchValue, setSearch] = useState('');
  const brightSpace = new BrightSpace();
  // Routing
  return (
    <Router>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          name="description"
          content="A Serverless React Based Chat Application Similar To Discord, Using Firebase."
        />
      </Head>
      {/* Page Essentials */}
      {/* NavBar */}
      <NavBar
        brightSpace={brightSpace}
        showAside={setShowAside}
        setSearch={setSearch}
      />
      {/* Aside */}
      <Aside
        brightSpace={brightSpace}
        Active={_showAside}
        showAside={setShowAside}
      />
      {/* Page Content */}
      <Routes>
        {/* TODO: We need to support mapping of things like when your on the content page */}
        {/* TODO: Fix page title */}
        <Route
          path="/d2l/home/:classID"
          element={
            <ClassRoom brightSpace={brightSpace} searchValue={_searchValue} />
          }
          loader={() => setPageTitle('Homepage - ClassRoom')}
        />
        <Route
          path="*"
          element={<ClassList brightSpace={brightSpace} />}
          loader={() => setPageTitle('Homepage - ClassList')}
        />
      </Routes>
    </Router>
  );
};

export default Application;
