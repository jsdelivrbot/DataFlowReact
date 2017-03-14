import React from 'react';
import { Route, IndexRoute } from 'react-router';
import DataFlowApp from './containers/app-dataflow';

import App from './components/app';

export default (
    <Route path="/" component={App}>
        {/*<IndexRoute component={} />*/}
        <Route path="dataflow" component={DataFlowApp} />
    </Route>
)