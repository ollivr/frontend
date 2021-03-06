/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Component
        :is="styleComponent"
        ref="activator"
        :style="{height, flexBasis: height }"
        :height="height"
        :focused="isFocused"
        :error="isError"
        :data-cy="dataCy"
        :disabled="disabled"
        :alignment="alignment"
        :size="size"
        :details-label="informationLabel"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mounted="onMounted">
        <template #activator>
            <InputController :size="size">
                <slot name="prepend" />
                <textarea
                    :id="associatedLabel"
                    :class="classes"
                    ref="input"
                    :style="textareaStyle"
                    :value="value"
                    :placeholder="placeholderValue"
                    :disabled="disabled"
                    :aria-label="label || 'no description'"
                    @input="onValueChange"
                    @focus="onFocus"
                    @blur="onBlur" />
                <InputLabel
                    v-if="label"
                    :style="{ top: 0 }"
                    :for="associatedLabel"
                    :required="required"
                    :size="size"
                    :floating="isFocused || !isEmpty"
                    :focused="isFocused"
                    :disabled="disabled"
                    :error="isError"
                    :label="label" />
                <template #append>
                    <slot name="append" />
                    <ErrorHint
                        v-if="isError"
                        :hint="errorMessages" />
                </template>
            </InputController>
        </template>
        <template #details>
            <slot name="details" />
        </template>
    </Component>
</template>

<script>
import InputController from '@Core/components/Inputs/InputController';
import InputLabel from '@Core/components/Inputs/InputLabel';
import {
    ALIGNMENT,
    INPUT_TYPE,
    SIZE,
} from '@Core/defaults/theme';
import associatedLabelMixin from '@Core/mixins/inputs/associatedLabelMixin';
import {
    toCapitalize,
} from '@Core/models/stringWrapper';

/**
 * `TextArea` is a default textarea input component.
 *  It might be configured with `prepend` and `append` slots.
 */
export default {
    name: 'TextArea',
    components: {
        InputController,
        InputLabel,
        ErrorHint: () => import('@Core/components/Hints/ErrorHint'),
    },
    mixins: [
        associatedLabelMixin,
    ],
    props: {
        size: {
            type: String,
            default: SIZE.REGULAR,
            validator: value => [
                SIZE.SMALL,
                SIZE.REGULAR,
            ].indexOf(value) !== -1,
        },
        height: {
            type: String,
            default: 'unset',
        },
        alignment: {
            type: String,
            default: ALIGNMENT.LEFT,
            validator: value => Object.values(ALIGNMENT).indexOf(value) !== -1,
        },
        type: {
            type: String,
            default: INPUT_TYPE.SOLID,
            validator: value => Object.values(INPUT_TYPE).indexOf(value) !== -1,
        },
        value: {
            type: [
                String,
                Number,
            ],
            default: null,
        },
        label: {
            type: String,
            default: null,
        },
        placeholder: {
            type: String,
            default: null,
        },
        errorMessages: {
            type: String,
            default: '',
        },
        hint: {
            type: String,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        resize: {
            type: String,
            default: 'auto',
        },
        dataCy: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            isFocused: false,
            isMouseMoving: false,
        };
    },
    computed: {
        classes() {
            return [
                'textarea',
                `textarea--${this.size}`,
                `textarea--${this.alignment}`,
            ];
        },
        textareaStyle() {
            return {
                resize: this.resize,
            };
        },
        styleComponent() {
            return () => import(`@Core/components/Inputs/Input${toCapitalize(this.type)}Style`);
        },
        isEmpty() {
            return this.value === '' || this.value === null;
        },
        isError() {
            return Boolean(this.errorMessages);
        },
        informationLabel() {
            return this.errorMessages || this.hint;
        },
        placeholderValue() {
            if (this.value || (this.label && !this.isFocused)) return null;

            return this.placeholder;
        },
    },
    methods: {
        onMounted() {
            if (this.autofocus) {
                this.$nextTick(() => {
                    window.requestAnimationFrame(() => {
                        this.$refs.input.focus();
                    });
                });
            }
        },
        onValueChange(event) {
            this.$emit('input', event.target.value);
        },
        onFocus() {
            this.isFocused = true;

            this.$emit('focus', true);
        },
        onBlur() {
            this.isFocused = false;

            this.$emit('focus', false);
        },
        onMouseDown(event) {
            this.$refs.activator.$el.addEventListener('mousemove', this.onMouseMove);

            const isClickedInsideInput = event.target === this.$refs.input;

            if (!isClickedInsideInput) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onMouseUp() {
            this.$refs.activator.$el.removeEventListener('mousemove', this.onMouseMove);

            // Manual handling of input focus
            if (!this.isMouseMoving) {
                this.$refs.input.focus();
            }

            this.isMouseMoving = false;
        },
        onMouseMove() {
            this.isMouseMoving = true;
        },
    },
};
</script>

<style lang="scss" scoped>
    .textarea {
        z-index: $Z_INDEX_LVL_2;
        flex: 1;
        outline: none;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        height: 100%;
        border: none;
        padding: 0;
        background-color: transparent;
        color: $GRAPHITE_DARK;

        &::placeholder {
            opacity: 0.4;
            color: $GRAPHITE_DARK;
        }

        &:disabled {
            color: $GRAPHITE_LIGHT;
        }

        &--small {
            font: $FONT_MEDIUM_12_16;
        }

        &--regular {
            font: $FONT_MEDIUM_14_20;
        }

        &--left {
            text-align: left;
        }

        &--center {
            text-align: center;
        }
    }
</style>
