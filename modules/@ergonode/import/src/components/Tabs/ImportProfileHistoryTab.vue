/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ResponsiveCenteredViewTemplate>
        <template #content>
            <Grid
                :columns="columns"
                :data-count="filtered"
                :rows="rows"
                :is-prefetching-data="isPrefetchingData"
                :is-basic-filter="true"
                :is-border="true"
                @previewRow="onPreviewRow"
                @fetchData="onFetchData" />
            <ImportDetailsModalGrid
                v-if="isImportDetailsModalVisible"
                :import-id="selectedRow.importId"
                :source-id="selectedRow.sourceId"
                @close="onCloseModalGrid" />
        </template>
    </ResponsiveCenteredViewTemplate>
</template>

<script>
import ResponsiveCenteredViewTemplate from '@Core/components/Layout/Templates/ResponsiveCenteredViewTemplate';
import fetchGridDataMixin from '@Core/mixins/grid/fetchGridDataMixin';

export default {
    name: 'CollectionProductsTab',
    components: {
        ResponsiveCenteredViewTemplate,
        ImportDetailsModalGrid: () => import('@Import/components/Modals/ImportDetailsModalGrid'),
    },
    mixins: [
        fetchGridDataMixin({
            path: 'sources/_id/imports',
        }),
    ],
    async fetch() {
        await this.onFetchData();
        this.isPrefetchingData = false;
    },
    data() {
        return {
            isPrefetchingData: true,
            isImportDetailsModalVisible: false,
            selectedRow: {
                importId: '',
                sourceId: '',
            },
        };
    },
    methods: {
        onPreviewRow(args) {
            const lastIndex = args.length - 1;
            const importId = args[lastIndex];
            const sourceId = args[lastIndex - 2];

            this.selectedRow = {
                importId,
                sourceId,
            };
            this.isImportDetailsModalVisible = true;
        },
        onCloseModalGrid() {
            this.isImportDetailsModalVisible = false;
        },
    },
};
</script>
