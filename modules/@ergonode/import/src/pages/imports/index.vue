/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Page>
        <TitleBar
            title="Import profiles"
            :is-read-only="isReadOnly">
            <template #mainAction>
                <Button
                    title="NEW IMPORT PROFILE"
                    :size="smallSize"
                    :disabled="!isAllowedToCreate"
                    @click.native="onShowModal">
                    <template #prepend="{ color }">
                        <IconAdd :fill-color="color" />
                    </template>
                </Button>
            </template>
        </TitleBar>
        <HorizontalRoutingTabBar :items="tabs">
            <template #content>
                <HorizontalRoutingTabBarContent
                    :is-fetching-needed="fetchGridData"
                    @fetched="onFetchedGridData" />
            </template>
        </HorizontalRoutingTabBar>
        <CreateImportProfileModalForm
            v-if="isModalVisible"
            @close="onCloseModal"
            @create="onCreatedData" />
    </Page>
</template>

<script>
import Button from '@Core/components/Button/Button';
import IconAdd from '@Core/components/Icons/Actions/IconAdd';
import {
    SIZE,
} from '@Core/defaults/theme';
import gridModalMixin from '@Core/mixins/modals/gridModalMixin';
import {
    getNestedTabRoutes,
} from '@Core/models/navigation/tabs';
import PRIVILEGES from '@Import/config/privileges';

export default {
    name: 'Imports',
    components: {
        TitleBar: () => import('@Core/components/TitleBar/TitleBar'),
        Page: () => import('@Core/components/Layout/Page'),
        HorizontalRoutingTabBar: () => import('@Core/components/TabBar/Routing/HorizontalRoutingTabBar'),
        CreateImportProfileModalForm: () => import('@Import/components/Modals/CreateImportProfileModalForm'),
        Button,
        IconAdd,
    },
    mixins: [
        gridModalMixin,
    ],
    computed: {
        isReadOnly() {
            return this.$isReadOnly(PRIVILEGES.IMPORT.namespace);
        },
        isAllowedToCreate() {
            return this.$hasAccess([
                PRIVILEGES.IMPORT.create,
            ]);
        },
        smallSize() {
            return SIZE.SMALL;
        },
        tabs() {
            return getNestedTabRoutes(this.$hasAccess, this.$router.options.routes, this.$route);
        },
    },
    head() {
        return {
            title: 'Import profiles - Ergonode',
        };
    },
};
</script>
