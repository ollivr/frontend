/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridTableCell
        :column="0"
        :row="row"
        editing-allowed
        :edit-key-code="32"
        :selected="isSelected"
        @mousedown.native="onSelect"
        @edit="onSelect">
        <GridCheckEditCell :value="isSelected" />
    </GridTableCell>
</template>

<script>

export default {
    name: 'GridSelectRowEditCell',
    components: {
        GridTableCell: () => import('@Core/components/Grid/Layout/Table/Cells/GridTableCell'),
        GridCheckEditCell: () => import('@Core/components/Grid/Layout/Table/Cells/Edit/GridCheckEditCell'),
    },
    props: {
        row: {
            type: Number,
            required: true,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onSelect() {
            this.$emit('select', {
                row: this.row,
                isSelected: !this.isSelected,
            });
        },
    },
};
</script>
