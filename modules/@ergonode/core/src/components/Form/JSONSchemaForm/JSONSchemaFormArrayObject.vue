/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <FormSubsection>
        <JSONSchemaFormTableRowWidget
            v-for="(row, index) in rowValues"
            :key="index"
            :index="index"
            :value="row"
            :schema="schema.items"
            @remove="onRemoveRowAtIndex"
            @input="onValueChangeAtIndex" />
        <Button
            ref="addSectionButton"
            title="ADD NEXT"
            :size="smallSize"
            :theme="secondaryTheme"
            @click.native="onAddRow">
            <template #prepend="{ color }">
                <IconAdd :fill-color="color" />
            </template>
        </Button>
    </FormSubsection>
</template>

<script>
import Button from '@Core/components/Button/Button';
import JSONSchemaFormTableRowWidget from '@Core/components/Form/JSONSchemaForm/JSONSchemaFormTableRowWidget';
import FormSubsection from '@Core/components/Form/Subsection/FormSubsection';
import IconAdd from '@Core/components/Icons/Actions/IconAdd';
import {
    SIZE,
    THEME,
} from '@Core/defaults/theme';

export default {
    name: 'JSONSchemaFormArrayObject',
    components: {
        FormSubsection,
        JSONSchemaFormTableRowWidget,
        IconAdd,
        Button,
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
            rowValues: this.value.length ? this.value : [
                {},
            ],
        };
    },
    computed: {
        smallSize() {
            return SIZE.SMALL;
        },
        secondaryTheme() {
            return THEME.SECONDARY;
        },
    },
    methods: {
        onAddRow() {
            this.$refs.addSectionButton.$el.scrollIntoView(true);
            this.rowValues.push({});
        },
        onRemoveRowAtIndex(index) {
            this.rowValues.splice(index, 1);
            this.$emit('input', this.rowValues);
        },
        onValueChangeAtIndex({
            index, value,
        }) {
            this.rowValues[index] = value;
            this.$emit('input', this.rowValues);
        },
    },
};
</script>
