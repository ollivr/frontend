/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <FormFieldset>
        <CheckBox
            v-for="title in schema.items.enum_titles"
            :key="title"
            :value="localValue"
            :label="title"
            @input="onValueChange" />
    </FormFieldset>
</template>

<script>
import FormFieldset from '@Core/components/Form/FormFieldset';
import CheckBox from '@Core/components/Inputs/CheckBox';

export default {
    name: 'JSONSchemaFormArrayString',
    components: {
        FormFieldset,
        CheckBox,
    },
    props: {
        schema: {
            type: Object,
            required: true,
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            localValue: this.getMappedTitles({
                key: 'enum',
                value: 'enum_titles',
                data: this.value,
            }),
        };
    },
    methods: {
        getMappedTitles({
            key, value, data,
        }) {
            const titles = [];

            for (let i = 0; i < data.length; i += 1) {
                const titleIndex = this.schema.items[key].findIndex(
                    option => option === data[i],
                );

                titles.push(this.schema.items[value][titleIndex]);
            }

            return titles;
        },
        onValueChange(value) {
            this.localValue = value;

            this.$emit('input', this.getMappedTitles({
                key: 'enum_titles',
                value: 'enum',
                data: value,
            }));
        },
    },
};
</script>
