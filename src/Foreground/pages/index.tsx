import React, { useEffect, useState } from 'react';
import Head from 'next/head';
// Import Views
import Loader from '../_Static/Views/Loader';
import ClassList from '../_Static/Views/ClassList';
// Application
const Application = () => {
  const [ content, setContent ] = useState(<Loader />);
  useEffect(() => {
    const pathname = window.location.pathname;
    switch (pathname) {
      case '/d2l/home':
      default:
        setContent(<ClassList />);
        break;
    }
  }, []);
  // Routing
  return (
    <>
      <Head>
        <title>test</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="description" content="A Serverless React Based Chat Application Similar To Discord, Using Firebase." />
      </Head>
      {content}
    </>
  );
};

export default Application;