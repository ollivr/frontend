/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ModalGrid
        title="Add products"
        :api-path="`${languageCode}/products`"
        :column-params="columnParams"
        :is-select-column="true"
        @close="onClose" />
</template>

<script>
import ModalGrid from '@Core/components/Modal/ModalGrid';
import {
    mapState,
} from 'vuex';

export default {
    name: 'AddProductsFromListModalGrid',
    components: {
        ModalGrid,
    },
    computed: {
        ...mapState('authentication', {
            languageCode: state => state.user.language,
        }),
        ...mapState('collections', {
            id: state => state.id,
        }),
        columnParams() {
            return 'index,sku,esa_template';
        },
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
    },
};
</script>
