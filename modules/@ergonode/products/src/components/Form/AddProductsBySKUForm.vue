/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Form :fields-keys="[skusFieldKey]">
        <template #body="{ errorMessages }">
            <FormSection>
                <TextArea
                    :value="productSkus"
                    label="By SKU"
                    hint="Separate multiple SKU’s by using enter or comma, e.g. “SKU1, SKU2, SKU3”"
                    resize="none"
                    height="150px"
                    :error-messages="errorMessages[skusFieldKey]"
                    :disabled="!isUserAllowedToUpdate"
                    @input="onSKUChange" />
            </FormSection>
        </template>
    </Form>
</template>

<script>

export default {
    name: 'AddProductsBySKUForm',
    components: {
        Form: () => import('@Core/components/Form/Form'),
        FormSection: () => import('@Core/components/Form/Section/FormSection'),
        TextArea: () => import('@Core/components/Inputs/TextArea'),
    },
    props: {
        productSkus: {
            type: String,
            default: '',
        },
        isUserAllowedToUpdate: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        skusFieldKey() {
            return 'skus';
        },
    },
    methods: {
        onSKUChange(value) {
            this.$emit('input', value);
        },
    },
};
</script>
