'use strict';

import React from 'react';
import CollectionList from '../pages/CollectionList'
import Collection from '../pages/Collection'
import Document from '../pages/Document'
import Login from '../pages/Login'
// Icons
// import DashboardIcon from 'material-ui/svg-icons/Action/dashboard';

const routes = [
    {
        path: '/collections',
        title: 'Collections',
        component: CollectionList,
    },
    {
        path: '/collections/:collection',
        title: 'Collection',
        component: Collection,
    },
    {
        path: '/collections/:collection/documents/:document',
        title: 'Document',
        component: Document,
    }
];

export default routes;
