/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridAdvancedFilterContent
        :value="value.isEmptyRecord"
        @input="onEmptyRecordChange">
        <div class="container">
            <TextField
                :value="operatorValue"
                :size="smallSize"
                :type="underlineInputType"
                @input="onValueChange" />
        </div>
    </GridAdvancedFilterContent>
</template>

<script>
import GridAdvancedFilterContent from '@Core/components/Grid/AdvancedFilters/Content/GridAdvancedFilterContent';
import TextField from '@Core/components/Inputs/TextField';
import {
    FILTER_OPERATOR,
} from '@Core/defaults/operators';
import {
    INPUT_TYPE,
    SIZE,
} from '@Core/defaults/theme';

export default {
    name: 'GridAdvancedFilterTextContent',
    components: {
        TextField,
        GridAdvancedFilterContent,
    },
    props: {
        value: {
            type: Object,
            default: () => ({
                isEmptyRecord: false,
            }),
        },
    },
    computed: {
        underlineInputType() {
            return INPUT_TYPE.UNDERLINE;
        },
        smallSize() {
            return SIZE.SMALL;
        },
        operatorValue() {
            return this.value[FILTER_OPERATOR.EQUAL] || '';
        },
    },
    methods: {
        onValueChange(value) {
            if (value !== this.operatorValue) {
                this.$emit('input', {
                    key: FILTER_OPERATOR.EQUAL,
                    value,
                });
            }
        },
        onEmptyRecordChange(value) {
            this.$emit('input', {
                value,
                key: 'isEmptyRecord',
            });
        },
    },
};
</script>

<style lang="scss" scoped>
    .container {
        padding: 8px 12px;
    }
</style>
