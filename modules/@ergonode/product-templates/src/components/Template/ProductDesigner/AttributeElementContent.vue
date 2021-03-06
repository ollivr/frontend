/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ElementContentBase
        :disabled="disabled"
        @mouseover.native="onMouseOver"
        @mouseout.native="onMouseOut">
        <div class="element-content__icon">
            <Component :is="attributeIconComponent" />
        </div>
        <div class="vertical-wrapper">
            <span
                :class="[typeLabelClasses, typeLabelRequireClass]"
                v-text="element.type" />
            <span
                class="element-content__subheader"
                v-text="element.label" />
        </div>
        <div
            v-if="!disabled"
            :class="['element-content__contextual-menu', contextualMenuHoveStateClasses]">
            <ActionIconButton
                :theme="secondaryPlainTheme"
                :size="tinySize"
                :options="contextualMenuItems"
                @input="onSelectValue"
                @focus="onSelectFocus">
                <template #icon="{ color }">
                    <IconDots :fill-color="color" />
                </template>
                <template #option="{ option }">
                    <ListElementDescription>
                        <ListElementTitle
                            :title="option"
                            :size="smallSize" />
                    </ListElementDescription>
                    <ListElementAction :size="smallSize">
                        <CheckBox
                            v-if="option === 'Required'"
                            ref="checkbox"
                            :value="element.required" />
                    </ListElementAction>
                </template>
            </ActionIconButton>
        </div>
    </ElementContentBase>
</template>

<script>
import ActionIconButton from '@Core/components/ActionIconButton/ActionIconButton';
import IconDots from '@Core/components/Icons/Others/IconDots';
import CheckBox from '@Core/components/Inputs/CheckBox';
import ListElement from '@Core/components/List/ListElement';
import ListElementAction from '@Core/components/List/ListElementAction';
import ListElementDescription from '@Core/components/List/ListElementDescription';
import ListElementTitle from '@Core/components/List/ListElementTitle';
import {
    SIZE,
    THEME,
} from '@Core/defaults/theme';
import {
    capitalizeAndConcatenationArray,
} from '@Core/models/stringWrapper';
import ElementContentBase from '@Templates/components/Template/ProductDesigner/ElementContentBase';
import {
    mapActions,
} from 'vuex';

export default {
    name: 'AttributeElementContent',
    components: {
        IconDots,
        ActionIconButton,
        ElementContentBase,
        ListElement,
        ListElementAction,
        ListElementTitle,
        ListElementDescription,
        CheckBox,
    },
    props: {
        index: {
            type: Number,
            required: true,
        },
        element: {
            type: Object,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            contextualMenuItems: [
                'Required',
                'Remove',
            ],
            isContextualMenuActive: false,
            isHovered: false,
        };
    },
    computed: {
        smallSize() {
            return SIZE.SMALL;
        },
        tinySize() {
            return SIZE.TINY;
        },
        secondaryPlainTheme() {
            return THEME.SECONDARY_PLAIN;
        },
        typeLabelRequireClass() {
            return {
                'element-content--required': this.element.required,
            };
        },
        typeLabelClasses() {
            return 'element-content__header';
        },
        attributeIconComponent() {
            if (!this.element.type) return '';

            const types = this.element.type.split('_');
            const attributeName = capitalizeAndConcatenationArray(types);

            return () => import(`@Core/components/Icons/Attributes/Icon${attributeName}`)
                .catch(() => import('@Core/components/Icons/Menu/IconAttributes'));
        },
        contextualMenuHoveStateClasses() {
            return {
                'element-content__contextual-menu--hovered': this.isHovered,
            };
        },
    },
    methods: {
        ...mapActions('templateDesigner', [
            'updateLayoutElementAtIndex',
            'removeLayoutElementAtIndex',
        ]),
        onSelectFocus(isFocused) {
            if (!isFocused) this.isHovered = false;

            this.isContextualMenuActive = isFocused;
        },
        onSelectValue(option) {
            switch (option) {
            case 'Required':
                this.updateLayoutElementAtIndex({
                    index: this.index,
                    element: {
                        ...this.element,
                        required: !this.element.required,
                    },
                });
                break;
            case 'Remove':
                this.removeLayoutElementAtIndex(this.index);
                break;
            default: break;
            }
        },
        onMouseOver() {
            if (!this.isHovered) this.isHovered = true;
        },
        onMouseOut() {
            if (!this.isContextualMenuActive) this.isHovered = false;
        },
    },
};
</script>

<style lang="scss" scoped>
    .element-content {
        .vertical-wrapper {
            display: flex;
            flex: 1;
            flex-direction: column;
            width: 0;
            padding: 6px 8px;
        }

        &__icon {
            display: flex;
            padding-top: 10px;
        }

        &__header {
            letter-spacing: 0.5px;
            color: $GRAPHITE_LIGHT;
            font: $FONT_SEMI_BOLD_12_16;
        }

        &__subheader {
            height: 20px;
            color: $GRAPHITE_DARK;
            font: $FONT_MEDIUM_14_20;
        }

        &__header, &__subheader {
            text-overflow: ellipsis;
            overflow: hidden;
        }

        &__contextual-menu {
            flex: 0;
            align-items: flex-start;
            padding: 12px 0;
            opacity: 0;

            &--hovered {
                opacity: 1;
            }
        }

        &--required::after {
            position: absolute;
            color: $RED;
            content: "*";
        }
    }
</style>
