import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { withRouter } from 'next/router';
import AppWrapper from 'docs/src/modules/components/AppWrapper';

const PagesContext = React.createContext({});

export const PagesConsumer = PagesContext.Consumer;

const pages = [
  {
    pathname: '/getting-started',
    children: [
      {
        pathname: '/getting-started/installation',
      },
      {
        pathname: '/getting-started/usage',
      },
      {
        pathname: '/getting-started/example-projects',
      },
      {
        pathname: '/getting-started/supported-platforms',
      },
    ],
  },
  {
    pathname: '/demos',
    title: 'Component Demos',
    children: [
      {
        pathname: '/demos/demos',
      },
    ],
  },
  {
    pathname: '/api',
    title: 'Component API',
    children: [
      {
        pathname: '/api/api',
      },
    ],
  },
  {
    pathname: '/',
    displayNav: false,
    title: false,
  },
];

function withRoot(Component) {
  class WithRoot extends React.Component {
    findActivePage(currentPages, router) {
      const activePage = find(currentPages, page => {
        if (page.children) {
          return router.pathname.indexOf(`${page.pathname}/`) === 0;
        }

        // Should be an exact match if no children
        return router.pathname === page.pathname;
      });

      if (!activePage) {
        return null;
      }

      // We need to drill down
      if (activePage.pathname !== router.pathname) {
        return this.findActivePage(activePage.children, router);
      }

      return activePage;
    }

    render() {
      // const { pageContext, ...other } = this.props;
      const { router, ...other } = this.props;
      let pathname = router.pathname;
      if (pathname !== '/') {
        // The leading / is only added to support static hosting (resolve /index.html).
        // We remove it to normalize the pathname.
        pathname = pathname.replace(/\/$/, '');
      }

      return (
        <React.StrictMode>
          <PagesContext.Provider
            value={{
              pages,
              activePage: this.findActivePage(pages, { ...router, pathname }),
            }}
          >
            <AppWrapper>
              <Component initialProps={other} />
            </AppWrapper>
          </PagesContext.Provider>
        </React.StrictMode>
      );
    }
  }

  WithRoot.propTypes = {
    pageContext: PropTypes.object,
    router: PropTypes.object.isRequired,
  };

  return withRouter(WithRoot);
}

export default withRoot;
