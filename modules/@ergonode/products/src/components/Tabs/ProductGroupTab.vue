/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ResponsiveCenteredViewTemplate>
        <template #content>
            <Grid
                :is-editable="isUserAllowedToUpdate"
                :columns="columns"
                :data-count="filtered"
                :rows="rows"
                :collection-cell-binding="collectionCellBinding"
                :is-collection-layout="true"
                :is-header-visible="true"
                :is-border="true"
                @fetchData="onFetchData">
                <template #actions>
                    <ActionButton
                        title="ADD PRODUCTS"
                        :theme="secondaryTheme"
                        :disabled="!isUserAllowedToUpdate"
                        :size="smallSize"
                        :options="addProductOptions"
                        :fixed-content="true"
                        @input="onSelectAddProductOption">
                        <template #prepend="{ color }">
                            <IconAdd :fill-color="color" />
                        </template>
                    </ActionButton>
                </template>
            </Grid>
            <Component
                v-if="selectedAppModalOption"
                :is="modalComponent"
                @close="onCloseModal"
                @added="onCreatedData" />
        </template>
    </ResponsiveCenteredViewTemplate>
</template>

<script>
import ActionButton from '@Core/components/ActionButton/ActionButton';
import IconAdd from '@Core/components/Icons/Actions/IconAdd';
import ResponsiveCenteredViewTemplate from '@Core/components/Layout/Templates/ResponsiveCenteredViewTemplate';
import {
    DATA_LIMIT,
    DEFAULT_GRID_FETCH_PARAMS,
} from '@Core/defaults/grid';
import {
    SIZE,
    THEME,
} from '@Core/defaults/theme';
import {
    getGridData,
} from '@Core/services/grid/getGridData.service';
import PRIVILEGES from '@Products/config/privileges';
import {
    ADD_PRODUCT,
    EXTENDS,
    PRODUCT_TYPE,
} from '@Products/defaults';
import {
    mapState,
} from 'vuex';

export default {
    name: 'ProductGroupTab',
    components: {
        ResponsiveCenteredViewTemplate,
        ActionButton,
        IconAdd,
        Grid: () => import('@Core/components/Grid/Grid'),
    },
    asyncData({
        app, store, params: {
            id,
        },
    }) {
        const {
            language: languageCode,
        } = store.state.authentication.user;
        const productsParams = {
            limit: 9999,
            offset: 0,
            view: 'list',
            order: 'ASC',
        };

        return app.$axios.$get(`${languageCode}/products/${id}/children`, {
            params: productsParams,
        }).then((productChildren) => {
            const params = {
                offset: 0,
                limit: DATA_LIMIT,
                extended: true,
                filter: `esa_product_type:${languageCode}=${PRODUCT_TYPE.SIMPLE_PRODUCT},${PRODUCT_TYPE.WITH_VARIANTS}`,
                columns: `esa_default_image:${languageCode},esa_default_label:${languageCode},esa_product_type:${languageCode},sku,esa_template:${languageCode}`,
            };

            return getGridData({
                $axios: app.$axios,
                path: `${languageCode}/products`,
                params,
            }).then(({
                columns,
                rows,
                filtered,
            }) => {
                const tmpRows = [
                    ...rows,
                ];

                for (let i = 0; i < tmpRows.length; i += 1) {
                    tmpRows[i].esa_attached = {
                        value: productChildren.collection
                            .some(item => item.id === rows[i].id.value),
                        sku: rows[i].sku.value,
                    };
                }

                return {
                    columns: [
                        ...columns.map(column => ({
                            ...column,
                            editable: false,
                            deletable: false,
                        })),
                        {
                            language: languageCode,
                            id: 'esa_attached',
                            type: 'PRODUCT_ATTACH',
                            label: 'Attached',
                            visible: true,
                            editable: true,
                            deletable: false,
                            parameters: [],
                        },
                    ],
                    filtered,
                    rows: tmpRows,
                };
            });
        });
    },
    data() {
        return {
            selectedAppModalOption: null,
            localParams: {
                offset: 0,
                limit: DATA_LIMIT,
                filters: {},
                sortedColumn: {},
            },
        };
    },
    computed: {
        ...mapState('product', {
            id: state => state.id,
        }),
        ...mapState('authentication', {
            languageCode: state => state.user.language,
        }),
        collectionCellBinding() {
            return {
                imageColumn: 'esa_default_image',
                descriptionColumn: 'esa_default_label',
            };
        },
        isUserAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.PRODUCT.update,
            ]);
        },
        smallSize() {
            return SIZE.SMALL;
        },
        secondaryTheme() {
            return THEME.SECONDARY;
        },
        addProductOptions() {
            const options = Object.values(ADD_PRODUCT);

            this.extendedComponents.forEach((option) => {
                options.push(option.name);
            });
            return options;
        },
        extendedComponents() {
            return this.$getExtendedComponents(EXTENDS.PRODUCT_GROUP_ADD_PRODUCTS);
        },
        modalComponent() {
            const modals = [
                {
                    component: () => import('@Products/components/Modals/AddProductsBySKUModalForm'),
                    name: ADD_PRODUCT.BY_SKU,
                },
                ...this.extendedComponents,
            ];

            return modals.find(modal => modal.name === this.selectedAppModalOption).component;
        },
    },
    methods: {
        onSelectAddProductOption(option) {
            this.selectedAppModalOption = option;
        },
        onCloseModal() {
            this.selectedAppModalOption = null;
        },
        onCreatedData() {
            this.onFetchData(this.localParams);
            this.selectedAppModalOption = null;
        },
        onFetchData({
            offset,
            limit,
            filters,
            sortedColumn,
        } = DEFAULT_GRID_FETCH_PARAMS) {
            this.localParams = {
                offset,
                limit,
                filters,
                sortedColumn,
            };

            const params = {
                offset,
                limit,
                extended: true,
                filter: `esa_product_type:${this.languageCode}=${PRODUCT_TYPE.SIMPLE_PRODUCT},${PRODUCT_TYPE.WITH_VARIANTS}`,
                columns: `esa_default_image:${this.languageCode},esa_default_label:${this.languageCode},esa_product_type:${this.languageCode},sku,esa_template:${this.languageCode}`,
            };

            if (Object.keys(sortedColumn).length) {
                const {
                    index: colSortID, orderState,
                } = sortedColumn;

                params.field = colSortID;
                params.order = orderState;
            }

            return getGridData({
                $axios: this.$axios,
                path: `${this.languageCode}/products`,
                params,
            }).then(({
                columns,
                rows,
                filtered,
            }) => {
                const productsParams = {
                    limit: 9999,
                    offset: 0,
                    view: 'list',
                    order: 'ASC',
                };

                return this.$axios.$get(`${this.languageCode}/products/${this.id}/children`, {
                    params: productsParams,
                }).then(({
                    collection,
                }) => {
                    const tmpRows = [
                        ...rows,
                    ];

                    for (let i = 0; i < rows.length; i += 1) {
                        tmpRows[i].esa_attached = {
                            value: collection.some(item => item.id === rows[i].id.value),
                            sku: rows[i].sku.value,
                        };
                    }

                    this.columns = [
                        ...columns.map(column => ({
                            ...column,
                            editable: false,
                            deletable: false,
                        })),
                        {
                            language: this.languageCode,
                            id: 'esa_attached',
                            type: 'PRODUCT_ATTACH',
                            label: 'Attached',
                            visible: true,
                            editable: true,
                            deletable: false,
                            parameters: [],
                        },
                    ];
                    this.filtered = filtered;
                    this.rows = rows;
                });
            });
        },
    },
};
</script>
