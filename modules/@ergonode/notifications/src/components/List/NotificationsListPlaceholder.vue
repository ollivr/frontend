/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Placeholder
        :layout-orientation="layoutOrientation"
        :title="title"
        :subtitle="subtitle"
        :bg-url="bgUrl"
        :color="color">
        <template #action>
            <slot name="action" />
        </template>
    </Placeholder>
</template>

<script>
import {
    WHITE,
} from '@Core/assets/scss/_js-variables/colors.scss';
import Placeholder from '@Core/components/Placeholder/Placeholder';
import {
    LAYOUT_ORIENTATION,
} from '@Core/defaults/layout';

export default {
    name: 'NotificationsListPlaceholder',
    components: {
        Placeholder,
    },
    props: {
        layoutOrientation: {
            type: String,
            default: LAYOUT_ORIENTATION.VERTICAL,
            validator: value => Object.values(LAYOUT_ORIENTATION).indexOf(value) !== -1,
        },
        title: {
            type: String,
            default: '',
        },
        subtitle: {
            type: String,
            default: '',
        },
        bgUrl: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: WHITE,
            validator: value => /^#([A-Fa-f0-9]{6})$/.test(value),
        },
    },
};
</script>
