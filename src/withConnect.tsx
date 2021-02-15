import * as React from 'react';

import rootAction from './actions';

import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ReduxState } from './types';

type States = { [key: string]: string }[];
type Actions = string[];

function withConnect<O = {}, S = {}, D = {}>(
  Component: React.ComponentType<O & S & D>,
  states?: States,
  actions?: Actions
) {
  const ComponentWithConnect: React.FC<any> = (props: O & S & D) => {
    return <Component {...props} />;
  };

  const mapStateToProps: MapStateToProps<S, O> = (state: ReduxState) => {
    return states
      ? (states
          .map((s) => {
            return Object.entries(s).map(([key, value]) => {
              return { [value]: state[key][value] };
            })[0];
          })
          .reduce((acc, curr) => Object.assign(acc, curr), {}) as S)
      : ({} as S);
  };

  const mapDispatchToProps: MapDispatchToProps<D, O> = (dispatch: Dispatch) => {
    return actions
      ? bindActionCreators(
          actions
            .map((s) => rootAction[s])
            .reduce((acc, curr) => Object.assign(acc, curr), {}),
          dispatch
        )
      : ({} as D);
  };

  return connect(mapStateToProps, mapDispatchToProps)(ComponentWithConnect);
}

export default withConnect;
