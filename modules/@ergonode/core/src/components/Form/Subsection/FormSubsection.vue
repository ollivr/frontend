/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <div :class="classes">
        <span
            v-if="title"
            class="form-subsection__title"
            v-text="title" />
        <slot />
    </div>
</template>

<script>
export default {
    name: 'FormSubsection',
    props: {
        title: {
            type: String,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes() {
            return [
                'form-subsection',
                {
                    'form-subsection--required': this.required,
                },
            ];
        },
    },
};
</script>

<style lang="scss" scoped>
    .form-subsection {
        $subsection: &;

        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 16px;

        &__title {
            color: $GRAPHITE_DARK;
            font: $FONT_SEMI_BOLD_14_20;

            &::after {
                color: $RED;
                content: "*";
            }
        }

        &--required {
            #{$subsection}__title::after {
                color: $RED;
                content: "*";
            }
        }
    }
</style>
