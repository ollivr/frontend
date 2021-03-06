/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import {
    Icons,
    Pages,
    Tabs,
} from './imports';
import PRIVILEGES from './privileges';

export default [
    {
        name: 'catalog',
        path: '/catalog',
        component: Pages.Products,
        meta: {
            access: true,
            title: 'Catalog',
            group: {
                title: 'Products',
                menuPosition: 2,
                icon: Icons.Product,
            },
            isMenu: true,
            menuPosition: 1,
            privileges: {
                namespace: PRIVILEGES.PRODUCT.namespace,
                read: PRIVILEGES.PRODUCT.read,
            },
            redirectTo: 'catalog-products',
        },
        children: [
            {
                name: 'catalog-products',
                path: 'products',
                component: Tabs.ProductCatalogTab,
                meta: {
                    title: '',
                    breadcrumbs: [
                        {
                            title: 'Products',
                            icon: Icons.Product,
                        },
                    ],
                    privileges: [],
                },
            },
        ],
    },
    {
        name: 'product-id',
        path: '/catalog/products/product/:id',
        component: Pages.ProductEdit,
        meta: {
            isMenu: false,
            redirectTo: 'product-id-general',
        },
        children: [
            {
                name: 'product-id-general',
                path: 'general',
                component: Tabs.ProductGeneralTab,
                meta: {
                    title: 'Options',
                    breadcrumbs: [
                        {
                            title: 'Products',
                            icon: Icons.Product,
                        },
                        {
                            title: 'Catalog',
                            routeName: 'catalog-products',
                        },
                    ],
                    privileges: [],
                },
            },
            {
                name: 'product-id-template',
                path: 'template',
                component: Tabs.ProductTemplateTab,
                meta: {
                    title: 'Template',
                    breadcrumbs: [
                        {
                            title: 'Products',
                            icon: Icons.Product,
                        },
                        {
                            title: 'Catalog',
                            routeName: 'catalog-products',
                        },
                    ],
                    privileges: [],
                },
            },
            {
                name: 'product-id-variants',
                path: 'variants',
                component: Tabs.ProductVariantsTab,
                meta: {
                    title: 'Variants',
                    breadcrumbs: [
                        {
                            title: 'Products',
                            icon: Icons.Product,
                        },
                        {
                            title: 'Catalog',
                            routeName: 'catalog-products',
                        },
                    ],
                    privileges: [],
                },
            },
            {
                name: 'product-id-group',
                path: 'group',
                component: Tabs.ProductGroupTab,
                meta: {
                    title: 'Group',
                    breadcrumbs: [
                        {
                            title: 'Products',
                            icon: Icons.Product,
                        },
                        {
                            title: 'Catalog',
                            routeName: 'catalog-products',
                        },
                    ],
                    privileges: [],
                },
            },
            {
                name: 'product-id-history',
                path: 'history',
                component: Tabs.ProductHistoryTab,
                meta: {
                    title: 'History',
                    breadcrumbs: [
                        {
                            title: 'Products',
                            icon: Icons.Product,
                        },
                        {
                            title: 'Catalog',
                            routeName: 'catalog-products',
                        },
                    ],
                    privileges: [],
                },
            },
        ],
    },
];
