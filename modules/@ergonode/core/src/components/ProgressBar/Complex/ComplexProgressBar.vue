/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <div class="complex-progress-bar">
        <span
            class="complex-progress-bar__label"
            v-text="label" />
        <div
            class="complex-progress-bar__progress"
            v-show="value > 0">
            <div
                class="complex-progress-bar__value"
                ref="value"
                :style="valueStyles" />
            <div
                v-if="value < maxValue && value > 0"
                ref="progressDivider"
                class="complex-progress-bar__progress-divider"
            />
        </div>
    </div>
</template>

<script>
import {
    GRAPHITE_DARK,
} from '@Core/assets/scss/_js-variables/colors.scss';

export default {
    name: 'ComplexProgressBar',
    props: {
        color: {
            type: String,
            default: GRAPHITE_DARK,
            validator: value => /^#([A-Fa-f0-9]{6})$/.test(value),
        },
        label: {
            type: String,
            default: '',
        },
        labelValue: {
            type: String,
            default: '',
        },
        value: {
            type: Number,
            default: 0,
        },
        maxValue: {
            type: Number,
            default: 100,
        },
    },
    data() {
        return {
            observer: null,
        };
    },
    computed: {
        progressStyle() {
            return {
                width: `${this.value}%`,
                backgroundColor: this.color,
            };
        },
        valueStyles() {
            return {
                backgroundColor: this.color,
            };
        },
    },
    mounted() {
        this.observer = new IntersectionObserver((entries) => {
            const progressBar = entries[0];
            if (progressBar.isIntersecting) {
                const {
                    offsetWidth,
                } = this.$el;
                const progressWidth = (this.value / this.maxValue) * offsetWidth;

                window.requestAnimationFrame(() => {
                    this.$refs.value.style.transform = `scaleX(${progressWidth})`;
                    this.$refs.progressDivider.style.transform = `translateX(${progressWidth - 1}px)`;
                });
                this.observer.disconnect();
            }
        });

        this.observer.observe(this.$el);
    },
    beforeDestroy() {
        this.observer.disconnect();
    },
};
</script>

<style lang="scss" scoped>
    .complex-progress-bar {
        width: 100%;

        &__progress {
            display: flex;
            margin-top: 8px;
            height: 4px;
            background-color: $GREY;
            box-shadow: $ELEVATOR_2_DP;
        }

        &__value {
            position: relative;
            width: 1px;
            height: 4px;
            will-change: transform;
            transform-origin: left;
        }

        &__progress-divider {
            width: 4px;
            height: 4px;
            background-color: $GRAPHITE_DARK;
            will-change: transform;
        }

        &__value, &__progress-divider {
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
        }

        &__label {
            color: $GREY;
            font: $FONT_MEDIUM_12_16;
        }

        &__label-value {
            margin: 3px 0 0 24px;
            color: $WHITE;
            font: $FONT_SEMI_BOLD_24_32;
        }
    }
</style>
