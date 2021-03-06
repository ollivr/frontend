/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ProductTemplateFormField
        :size="size"
        :position="position">
        <FormValidatorField :field-key="fieldKey">
            <template #validator="{ errorMessages }">
                <TranslationSelect
                    :value="fieldData"
                    :clearable="true"
                    :label="label"
                    :options="options"
                    :placeholder="properties.placeholder"
                    :error-messages="errorMessages"
                    :required="properties.required"
                    :disabled="disabled"
                    @input="debounceValueChange">
                    <template #append>
                        <InfoHint
                            v-if="properties.hint"
                            :hint="properties.hint" />
                    </template>
                    <template #details>
                        <div />
                    </template>
                </TranslationSelect>
            </template>
        </FormValidatorField>
    </ProductTemplateFormField>
</template>

<script>
import FormValidatorField from '@Core/components/Form/Field/FormValidatorField';
import InfoHint from '@Core/components/Hints/InfoHint';
import TranslationSelect from '@Core/components/Inputs/Select/TranslationSelect';
import {
    getMappedObjectOption,
    getMappedObjectOptions,
} from '@Core/models/mappers/translationsMapper';
import ProductTemplateFormField from '@Products/components/Form/Field/ProductTemplateFormField';
import {
    debounce,
} from 'debounce';
import {
    mapActions,
    mapState,
} from 'vuex';

export default {
    name: 'ProductTemplateFormSelectField',
    components: {
        ProductTemplateFormField,
        TranslationSelect,
        FormValidatorField,
        InfoHint,
    },
    props: {
        size: {
            type: Object,
            default: () => ({}),
        },
        position: {
            type: Object,
            default: () => ({}),
        },
        properties: {
            type: Object,
            default: () => ({}),
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: '',
        },
        languageCode: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            debounceValueChange: null,
        };
    },
    computed: {
        ...mapState('product', {
            draft: state => state.draft,
        }),
        fieldData() {
            const {
                attribute_code,
            } = this.properties;
            const value = this.draft[this.languageCode][attribute_code];

            if (!this.hasOptions || !value) {
                return '';
            }

            return getMappedObjectOption({
                option: {
                    id: value,
                    ...this.properties.options[value],
                },
                languageCode: this.languageCode,
            });
        },
        fieldKey() {
            return `${this.properties.attribute_code}/${this.languageCode}`;
        },
        hasOptions() {
            return typeof this.properties.options !== 'undefined';
        },
        options() {
            if (!this.hasOptions) return [];

            return getMappedObjectOptions({
                options: this.properties.options,
                languageCode: this.languageCode,
            });
        },
    },
    created() {
        this.debounceValueChange = debounce(this.onValueChange, 500);
    },
    methods: {
        ...mapActions('product', [
            'setDraftValue',
        ]),
        onValueChange(value) {
            this.setDraftValue({
                languageCode: this.languageCode,
                key: this.properties.attribute_code,
                value: value.id,
            });

            this.$emit('input', {
                fieldKey: this.fieldKey,
                languageCode: this.languageCode,
                productId: this.$route.params.id,
                elementId: this.properties.attribute_id,
                value: value.id,
            });
        },
    },
};
</script>
