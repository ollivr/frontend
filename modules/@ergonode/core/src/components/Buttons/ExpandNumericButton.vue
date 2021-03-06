/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Button
        :size="smallSize"
        :theme="theme"
        :title="title"
        @click.native="onExpand">
        <template #prepend="{ color }">
            <IconArrowDouble
                :fill-color="color"
                :state="iconExpandedState" />
        </template>
        <template #append>
            <div
                :class="[
                    'expand-number',
                    { 'expand-number--selected': isExpanded },
                ]">
                <NumericBadge :number="number" />
            </div>
        </template>
    </Button>
</template>

<script>
import {
    ARROW,
} from '@Core/defaults/icons';
import {
    SIZE,
    THEME,
} from '@Core/defaults/theme';

export default {
    name: 'ExpandNumericButton',
    components: {
        Button: () => import('@Core/components/Button/Button'),
        NumericBadge: () => import('@Core/components/Badges/NumericBadge'),
        IconArrowDouble: () => import('@Core/components/Icons/Arrows/IconArrowDouble'),
    },
    props: {
        isExpanded: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            required: true,
        },
        number: {
            type: Number,
            default: 0,
        },
    },
    computed: {
        theme() {
            return this.isExpanded ? THEME.PRIMARY : THEME.SECONDARY;
        },
        smallSize() {
            return SIZE.SMALL;
        },
        iconExpandedState() {
            return this.isExpanded ? ARROW.UP : ARROW.DOWN;
        },
    },
    methods: {
        onExpand() {
            this.$emit('expand', !this.isExpanded);
        },
    },
};
</script>

<style lang="scss" scoped>
    .expand-number {
        margin: 0 4px;

        &--selected {
            .badge--primary {
                background-color: $GREEN_DARK;
            }
        }
    }
</style>
