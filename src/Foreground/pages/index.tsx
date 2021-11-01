import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Brightspace from '../_Static/Classes/Brightspace';
// Import Views
import Loader from '../_Static/Views/Loader';
import ClassList from '../_Static/Views/ClassList';
import ClassRoom from '../_Static/Views/ClassRoom';
// Application
const Application = () => {
  const [content, setContent] = useState(<Loader />);
  // TODO: make this dynamic per school board
  const [pageTitle, setPageTitle] = useState('Homepage - ClassList');
  // TODO: add more routes make routing dynamic, create a custom router, try to avoid the loader.
  const route = (brightSpace: Brightspace) => {
    const pathname = window.location.pathname;
    switch (true) {
      // TODO: Add more routes, find some sort of way to route on the background page using a single routing library that way we do not load the page and destroy d2l's page if we dont have the a route for the content, make sure to consider performance in this though, alternatively use static routes with the declarative net api over the webRequest api.
      case /\/d2l\/home\/([^/]*)$/.test(pathname): {
        const id =
          pathname.match(/\/d2l\/home\/(?<id>[^/]*)$/)?.groups?.id || '';
        setContent(
          <ClassRoom brightSpace={brightSpace} Route={route} ClassId={id} />
        );
        setPageTitle('Homepage - ClassRoom');
        break;
      }
      case pathname == '/d2l/home':
      default:
        setContent(<ClassList brightSpace={brightSpace} Route={route} />);
        console.log(window.location.pathname);
        setPageTitle('Homepage - ClassList');
        break;
    }
  };
  useEffect(() => {
    const brightSpace = new Brightspace();
    route(brightSpace);
  }, []);
  // Routing
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          name="description"
          content="A Serverless React Based Chat Application Similar To Discord, Using Firebase."
        />
      </Head>
      {content}
    </>
  );
};

export default Application;
