/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <div :class="classes">
        <div class="header-container">
            <h2
                v-if="title"
                class="modal-confirm-header__title"
                v-text="title" />
            <span
                v-if="subtitle"
                class="modal-confirm-header__subtitle"
                v-text="subtitle" />
        </div>
        <Fab
            data-cy="modal-close"
            :floating="{ top: '16px', right: '16px' }"
            :theme="secondaryTheme"
            @click.native="onClose">
            <template #icon="{ color }">
                <IconClose :fill-color="color" />
            </template>
        </Fab>
    </div>
</template>

<script>
import Fab from '@Core/components/Fab/Fab';
import IconClose from '@Core/components/Icons/Window/IconClose';
import {
    THEME,
} from '@Core/defaults/theme';

export default {
    name: 'ModalConfirmHeader',
    components: {
        Fab,
        IconClose,
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        subtitle: {
            type: String,
            default: '',
        },
    },
    computed: {
        classes() {
            return [
                'modal-confirm-header',
            ];
        },
        secondaryTheme() {
            return THEME.SECONDARY;
        },
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
    },
};
</script>

<style lang="scss" scoped>
    .modal-confirm-header {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 48px 24px 24px;
        box-sizing: border-box;

        &__title {
            color: $GRAPHITE_DARK;
            font: $FONT_SEMI_BOLD_16_24;
        }

        &__subtitle {
            color: $GRAPHITE_DARK;
            font: $FONT_MEDIUM_14_20;
        }
    }

    .header-container {
        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 8px;
        align-items: center;
    }
</style>
