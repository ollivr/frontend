/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <div class="page-selector">
        <span class="page-selector__text">
            Show
        </span>
        <Select
            :value="value"
            :options="rowIntervalOptions"
            :size="smallSize"
            @input="onValueChange" />
        <span
            class="page-selector__text"
            v-text="infoText" />
    </div>
</template>

<script>
import Select from '@Core/components/Inputs/Select/Select';
import {
    ROW_INTERVALS,
} from '@Core/defaults/grid';
import {
    SIZE,
} from '@Core/defaults/theme';

export default {
    name: 'GridPageSelector',
    components: {
        Select,
    },
    props: {
        maxRows: {
            type: Number,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    computed: {
        smallSize() {
            return SIZE.SMALL;
        },
        infoText() {
            return `of ${this.maxRows}`;
        },
        rowIntervalOptions() {
            return ROW_INTERVALS;
        },
    },
    methods: {
        onValueChange(value) {
            this.$emit('input', value);
        },
    },
};
</script>

<style lang="scss" scoped>
    .page-selector {
        display: grid;
        align-items: center;
        grid-template-columns: max-content 72px max-content;
        grid-auto-flow: column;
        column-gap: 8px;

        &__text {
            color: $GRAPHITE_DARK;
            font: $FONT_MEDIUM_12_16;
        }
    }
</style>
