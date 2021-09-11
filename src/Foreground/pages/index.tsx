import React, { useEffect, useState } from 'react';
import Head from 'next/head';
// Import Views
import Loader from '../_Static/Views/Loader';
import ClassList from '../_Static/Views/ClassList';
// Application
const Application = () => {
  const [ content, setContent ] = useState(<Loader />);
  // TODO: add more routes make routing dynamic, create a custom router, try to avoid the loader.
  // TODO: Make Brightspace API, Initialize api pass it as a property
  useEffect(() => {
    const pathname = window.location.pathname;
    switch (pathname) {
      // TODO: Add more routes, find some sort of way to route on the background page using a single routing library that way we do not load the page and destroy d2l's page if we dont have the a route for the content, make sure to consider performance in this though, alternatively use static routes with the declarative net api over the webRequest api.
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