/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridViewTemplate>
        <template #sidebar>
            <VerticalTabBar :items="verticalTabs">
                <FadeTransition>
                    <DropZone
                        v-show="isDropZoneVisible"
                        :hover-background-color="graphiteLightColor"
                        :title="dropZoneTitle">
                        <template #icon="{ color }">
                            <Component
                                :is="dropZoneIconComponent"
                                :fill-color="color" />
                        </template>
                    </DropZone>
                </FadeTransition>
            </VerticalTabBar>
        </template>
        <template #grid>
            <Grid
                :is-editable="isUserAllowedToUpdate"
                :columns="columns"
                :rows="rows"
                :placeholder="noRecordsPlaceholder"
                :drafts="drafts"
                :advanced-filters="advancedFilters"
                :data-count="filtered"
                :collection-cell-binding="collectionCellBinding"
                :is-prefetching-data="isPrefetchingData"
                :is-advanced-filters="true"
                :is-header-visible="true"
                :is-basic-filter="true"
                :is-collection-layout="true"
                @editRow="onEditRow"
                @cellValue="onCellValueChange"
                @focusCell="onFocusCell"
                @deleteRow="onRemoveRow"
                @dropColumn="onDropColumn"
                @dropFilter="onDropFilter"
                @fetchData="onFetchData">
                <template #actions>
                    <ExpandNumericButton
                        title="FILTERS"
                        :number="filtersCount"
                        :is-expanded="isFiltersExpanded"
                        @click.native="onFiltersExpand" />
                    <!--
                      Uncomment when product draft will be change on grid
                      <Button
                        :theme="secondaryTheme"
                        :size="smallSize"
                        title="RESTORE"
                        :disabled="!isUserAllowedToRestore"
                        @click.native="onShowModal">
                        <template #prepend="{ color }">
                            <IconRestore :fill-color="color" />
                        </template>
                    </Button> -->
                    <!-- <RestoreAttributeParentModalConfirm
                        v-if="isModalVisible"
                        :element="focusedCellToRestore"
                        @close="onCloseConfirmModal"
                        @restore="onRestoreDraftSuccess" /> -->
                </template>
                <template #appendFooter>
                    <Button
                        title="SAVE CHANGES"
                        :size="smallSize"
                        :disabled="!isUserAllowedToUpdate || $isLoading('footerDraftButton')"
                        @click.native="onSaveDrafts" />
                </template>
            </Grid>
        </template>
    </GridViewTemplate>
</template>

<script>
// import getProductDraft from '@Products/services/getProductDraft.service';
import {
    GRAPHITE_LIGHT,
    WHITESMOKE,
} from '@Core/assets/scss/_js-variables/colors.scss';
import Button from '@Core/components/Button/Button';
import DropZone from '@Core/components/DropZone/DropZone';
import IconRemoveColumn from '@Core/components/Icons/Actions/IconRemoveColumn';
import IconRemoveFilter from '@Core/components/Icons/Actions/IconRemoveFilter';
import GridViewTemplate from '@Core/components/Layout/Templates/GridViewTemplate';
import VerticalTabBar from '@Core/components/TabBar/VerticalTabBar';
import FadeTransition from '@Core/components/Transitions/FadeTransition';
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    DRAGGED_ELEMENT,
} from '@Core/defaults/grid';
import {
    SIZE,
    THEME,
} from '@Core/defaults/theme';
import fetchAdvancedFiltersDataMixin from '@Core/mixins/grid/fetchAdvancedFiltersDataMixin';
import fetchGridDataMixin from '@Core/mixins/grid/fetchGridDataMixin';
import gridDraftMixin from '@Core/mixins/grid/gridDraftMixin';
import gridModalMixin from '@Core/mixins/modals/gridModalMixin';
import PRIVILEGES from '@Products/config/privileges';
import {
    mapActions,
    mapState,
} from 'vuex';

const updateProductDraft = () => import('@Products/services/updateProductDraft.service');
const applyProductDraft = () => import('@Products/services/applyProductDraft.service');

export default {
    name: 'ProductCatalogTab',
    components: {
        GridViewTemplate,
        Button,
        DropZone,
        VerticalTabBar,
        IconRemoveFilter,
        IconRemoveColumn,
        FadeTransition,
        // RestoreAttributeParentModalConfirm: () => import('@Products/components/Modals/RestoreAttributeParentModalConfirm'),
        // IconRestore: () => import('@Core/components/Icons/Actions/IconRestore'),
    },
    mixins: [
        gridModalMixin,
        fetchGridDataMixin({
            path: 'products',
            defaultColumns: 'index,sku,_links,esa_default_image,esa_default_label',
        }),
        fetchAdvancedFiltersDataMixin({
            path: 'products',
        }),
        gridDraftMixin,
    ],
    fetch() {
        const requests = [
            this.onFetchData(),
        ];
        const advFiltersIds = this.$cookies.get(`GRID_ADV_FILTERS_CONFIG:${this.$route.name}`);

        if (advFiltersIds) {
            requests.push(this.onFetchAdvancedFilters(advFiltersIds));
        }

        return Promise.all(requests).then(() => {
            this.isPrefetchingData = false;
            this.setDisabledElements(this.getDisabledElements({
                columns: this.columns,
                filters: this.advancedFilters,
            }));
        });
    },
    data() {
        return {
            isPrefetchingData: true,
            focusedCellToRestore: null,
        };
    },
    computed: {
        ...mapState('authentication', {
            userLanguageCode: state => state.user.language,
        }),
        ...mapState('draggable', {
            isElementDragging: state => state.isElementDragging,
            draggedElement: state => state.draggedElement,
        }),
        noRecordsPlaceholder() {
            return {
                title: 'No products',
                subtitle: 'There are no products in the system, you can create the first one.',
                bgUrl: require('@Core/assets/images/placeholders/comments.svg'),
                color: WHITESMOKE,
            };
        },
        graphiteLightColor() {
            return GRAPHITE_LIGHT;
        },
        isDropZoneVisible() {
            if (this.draggedElement
                && typeof this.draggedElement.deletable !== 'undefined'
                && !this.draggedElement.deletable) {
                return false;
            }

            return this.isElementDragging === DRAGGED_ELEMENT.COLUMN
                || this.isElementDragging === DRAGGED_ELEMENT.FILTER;
        },
        dropZoneTitle() {
            if (!this.isElementDragging) {
                return '';
            }

            return this.isElementDragging === DRAGGED_ELEMENT.COLUMN
                ? 'REMOVE COLUMN'
                : 'REMOVE FILTER';
        },
        dropZoneIconComponent() {
            if (!this.isElementDragging) {
                return null;
            }

            return this.isElementDragging === DRAGGED_ELEMENT.COLUMN
                ? IconRemoveColumn
                : IconRemoveFilter;
        },
        collectionCellBinding() {
            return {
                imageColumn: 'esa_default_image',
                descriptionColumn: 'esa_default_label',
            };
        },
        smallSize() {
            return SIZE.SMALL;
        },
        secondaryTheme() {
            return THEME.SECONDARY;
        },
        verticalTabs() {
            return [
                {
                    title: 'Product attributes',
                    component: () => import('@Attributes/components/Tabs/List/AttributesListTab'),
                    iconComponent: () => import('@Core/components/Icons/Menu/IconAttributes'),
                    props: {},
                },
                {
                    title: 'System attributes',
                    component: () => import('@Attributes/components/Tabs/List/SystemAttributesListTab'),
                    iconComponent: () => import('@Core/components/Icons/Menu/IconSettings'),
                    props: {},
                },
            ];
        },
        isUserAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.PRODUCT.update,
            ]);
        },
        isUserAllowedToRestore() {
            return this.$hasAccess([
                PRIVILEGES.PRODUCT.update,
            ]) && this.focusedCellToRestore;
        },
    },
    methods: {
        ...mapActions('list', [
            'setDisabledElement',
            'setDisabledElements',
        ]),
        onCellValueChange(cellValues) {
            const cachedElementIds = {};

            const drafts = cellValues.reduce((prev, {
                rowId, columnId, value,
            }) => {
                const tmp = prev;
                tmp[`${rowId}/${columnId}`] = value;
                return tmp;
            }, {});

            this.setDrafts({
                ...this.drafts,
                ...drafts,
            });

            const requests = cellValues.map(({
                rowId, columnId, value,
            }) => {
                if (!cachedElementIds[columnId]) {
                    const {
                        element_id,
                    } = this.columns.find(column => column.id === columnId);

                    cachedElementIds[columnId] = element_id;
                }

                return updateProductDraft().then(response => response.default({
                    $axios: this.$axios,
                    $store: this.$store,
                    fieldKey: `${rowId}/${columnId}`,
                    languageCode: columnId.split(':')[1],
                    productId: rowId,
                    elementId: cachedElementIds[columnId],
                    value,
                }));
            });

            Promise.all(requests);
        },
        onFocusCell({
            column, rowId,
        }) {
            if (column) {
                if (rowId && column.element_id) {
                    this.focusedCellToRestore = {
                        languageCode: column.language,
                        attribute: column,
                        productId: rowId,
                    };
                } else {
                    this.focusedCellToRestore = null;
                }
            } else {
                this.focusedCellToRestore = null;
            }
        },
        onCloseConfirmModal() {
            this.focusedCellToRestore = null;
            this.onCloseModal();
        },
        // async onRestoreDraftSuccess({ languageCode, productId, attribute }) {
        //     const { attributes } = await getProductDraft({
        //         $axios: this.$axios,
        //         languageCode,
        //         id: productId,
        //     });
        //     const [attributeKey] = attribute.id.split(':');
        //     const restoredValue = attributes[attributeKey] || null;
        // },
        onEditRow(args) {
            const lastIndex = args.length - 1;

            this.$router.push({
                name: 'product-id-general',
                params: {
                    id: args[lastIndex],
                },
            });
        },
        async onSaveDrafts() {
            const promises = [];

            const applyProductDraftModule = await applyProductDraft()
                .then(request => request.default);

            Object.keys(this.drafts).forEach((key) => {
                const [
                    rowId,
                ] = key.split('/');

                promises.push(applyProductDraftModule({
                    $axios: this.$axios,
                    $store: this.$store,
                    id: rowId,
                }).then(() => this.removeDraftRow(rowId)));
            });

            await this.$setLoader('footerDraftButton');
            await Promise.all(promises).then(() => {
                this.onFetchData(this.localParams);
                this.$addAlert({
                    type: ALERT_TYPE.SUCCESS,
                    message: 'Product changes saved',
                });
            });
            await this.$removeLoader('footerDraftButton');
        },
        getDisabledElements({
            columns, filters,
        }) {
            const disabledElements = {};

            const elements = [
                ...columns.map(column => ({
                    languageCode: column.language,
                    attributeId: column.element_id,
                })),
                ...filters.map(filter => ({
                    languageCode: filter.languageCode,
                    attributeId: filter.attributeId,
                })),
            ];

            elements.forEach((element) => {
                const {
                    attributeId,
                    languageCode,
                } = element;

                if (attributeId && languageCode) {
                    if (typeof disabledElements[languageCode] === 'undefined') {
                        disabledElements[languageCode] = {};
                    }

                    disabledElements[languageCode][attributeId] = Boolean(
                        disabledElements[languageCode]
                        && typeof disabledElements[languageCode][attributeId] !== 'undefined',
                    );
                }
            });

            return disabledElements;
        },
    },
};
</script>
