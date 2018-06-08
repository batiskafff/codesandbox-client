import React from 'react';
import gql from 'graphql-tag';
import { sortBy, uniq } from 'lodash';
import { inject, observer, Observer } from 'mobx-react';
import { Query } from 'react-apollo';

import { basename } from 'path';

import Sandboxes from '../Sandboxes';
import Navigation from './Navigation';

import { PATHED_SANDBOXES_CONTENT_QUERY } from '../../queries';

const PathedSandboxes = props => {
  const path = '/' + (props.match.params.path || '');

  document.title = `CodeSandbox - ${basename(path) || 'Dashboard'}`;

  return (
    <Query query={PATHED_SANDBOXES_CONTENT_QUERY} variables={{ path }}>
      {({ loading, error, data }) => (
        <Observer>
          {() => {
            if (error) {
              console.error(error);
              return <div>Error!</div>;
            }

            const sandboxes =
              loading || !data.me.collection
                ? []
                : data.me.collection.sandboxes;

            const possibleTemplates = uniq(
              sandboxes.map(x => x.source.template)
            );

            const orderedSandboxes = props.store.dashboard.getFilteredSandboxes(
              sandboxes
            );

            return (
              <Sandboxes
                isLoading={loading}
                possibleTemplates={possibleTemplates}
                Header={<Navigation path={path} />}
                sandboxes={orderedSandboxes}
              />
            );
          }}
        </Observer>
      )}
    </Query>
  );
};

export default inject('store', 'signals')(observer(PathedSandboxes));
