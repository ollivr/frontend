/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <svg
        class="spinner"
        :width="width"
        :height="height"
        viewBox="0 0 50 50">
        <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            :stroke="color"
            stroke-width="5"
        />
    </svg>
</template>

<script>
import {
    WHITE,
} from '@Core/assets/scss/_js-variables/colors.scss';

export default {
    name: 'IconSpinner',
    props: {
        color: {
            type: String,
            default: WHITE,
            validator: value => /^#([A-Fa-f0-9]{6})$/.test(value),
        },
        width: {
            type: [
                Number,
                String,
            ],
            default: 24,
        },
        height: {
            type: [
                Number,
                String,
            ],
            default: 24,
        },
    },
};
</script>

<style lang="scss" scoped>
    .spinner {
        animation: rotate 2s linear infinite;

        & .path {
            stroke-linecap: round;
            animation: dash 1.5s ease-in-out infinite;
        }
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray:
                1,
                150;
            stroke-dashoffset: 0;
        }

        50% {
            stroke-dasharray:
                90,
                150;
            stroke-dashoffset: -35;
        }

        100% {
            stroke-dasharray:
                90,
                150;
            stroke-dashoffset: -124;
        }
    }
</style>
