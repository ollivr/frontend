/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ModalForm
        title="Add products by SKU"
        @close="onClose">
        <template #body>
            <AddProductsBySKUForm
                :product-skus="productSkus"
                :is-user-allowed-to-update="isUserAllowedToUpdate"
                @input="onFormValueChange" />
        </template>
        <template #footer>
            <Button
                title="ADD TO COLLECTION"
                :disabled="isRequestPending"
                @click.native="onAdd" />
            <Button
                title="CANCEL"
                :theme="secondaryTheme"
                @click.native="onClose" />
        </template>
    </ModalForm>
</template>

<script>
import PRIVILEGES from '@Collections/config/privileges';
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    THEME,
} from '@Core/defaults/theme';
import {
    mapActions,
    mapState,
} from 'vuex';

export default {
    name: 'AddProductsBySKUModalForm',
    components: {
        AddProductsBySKUForm: () => import('@Products/components/Form/AddProductsBySKUForm'),
        ModalForm: () => import('@Core/components/Modal/ModalForm'),
        Button: () => import('@Core/components/Button/Button'),
    },
    data() {
        return {
            productSkus: '',
            isRequestPending: false,
        };
    },
    computed: {
        ...mapState('authentication', {
            language: state => state.user.language,
        }),
        ...mapState('collections', {
            id: state => state.id,
        }),
        secondaryTheme() {
            return THEME.SECONDARY;
        },
        isUserAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.PRODUCT_COLLECTION.update,
            ]);
        },
    },
    methods: {
        ...mapActions('validations', [
            'onError',
            'removeValidationErrors',
        ]),
        onFormValueChange(value) {
            this.productSkus = value;
        },
        onClose() {
            this.$emit('close');
        },
        onAdd() {
            this.removeValidationErrors();
            const data = {
                skus: this.productSkus.replace(/\n/g, ',').split(','),
            };

            this.isRequestPending = true;
            this.$axios.$post(`${this.language}/collections/${this.id}/elements/add-from-skus`, data).then(() => {
                this.isRequestPending = false;
                this.removeValidationErrors();
                this.$addAlert({
                    type: ALERT_TYPE.SUCCESS,
                    message: 'Products has been added to collection',
                });

                this.$emit('added');
            }).catch((e) => {
                this.isRequestPending = false;
                this.onError(e.data);
            });
        },
    },
};
</script>
