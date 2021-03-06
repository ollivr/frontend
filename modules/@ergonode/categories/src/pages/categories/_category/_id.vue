/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <CategoryPage
        :title="code"
        @remove="onRemove"
        @save="onSave" />
</template>

<script>
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    MODAL_TYPE,
} from '@Core/defaults/modals';
import {
    mapActions,
    mapState,
} from 'vuex';

export default {
    name: 'EditCategory',
    components: {
        CategoryPage: () => import('@Categories/components/Pages/CategoryPage'),
    },
    validate({
        params,
    }) {
        return /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(params.id);
    },
    async fetch({
        store,
        params,
    }) {
        await Promise.all([
            store.dispatch('translations/__clearStorage'),
            store.dispatch('categories/__clearStorage'),
        ]);
        await store.dispatch('categories/getCategory', {
            categoryId: params.id,
        });
    },
    computed: {
        ...mapState('categories', {
            id: state => state.id,
            code: state => state.code,
        }),
        ...mapState('translations', {
            translations: state => state.translations,
        }),
    },
    methods: {
        ...mapActions('categories', [
            'updateCategory',
            'removeCategory',
        ]),
        ...mapActions('validations', [
            'onError',
            'removeValidationErrors',
        ]),
        onRemove() {
            this.$openModal({
                key: MODAL_TYPE.GLOBAL_CONFIRM_MODAL,
                message: 'Are you sure you want to delete this category?',
                confirmCallback: () => this.removeCategory({
                    onSuccess: this.onRemoveSuccess,
                }),
            });
        },
        onSave() {
            this.removeValidationErrors();
            const {
                name,
            } = this.translations;
            const data = {
                name,
            };

            this.updateCategory({
                id: this.id,
                data,
                onSuccess: this.onUpdateCategorySuccess,
                onError: this.onError,
            });
        },
        onUpdateCategorySuccess() {
            this.removeValidationErrors();
            this.$addAlert({
                type: ALERT_TYPE.SUCCESS,
                message: 'Category updated',
            });
        },
        onRemoveSuccess() {
            this.$addAlert({
                type: ALERT_TYPE.SUCCESS,
                message: 'Category removed',
            });
            this.$router.push({
                name: 'categories-grid',
            });
        },
    },
    head() {
        return {
            title: `${this.code} - Categories - Ergonode`,
        };
    },
};
</script>
