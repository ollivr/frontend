/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ListDraggableElement
        :is-draggable="!disabled"
        :is-disabled="disabled"
        :draggable-id="item.id"
        :label="item.name"
        @drag="onDrag">
        <ListElementDescription>
            <ListElementTitle :title="item.name" />
        </ListElementDescription>
    </ListDraggableElement>
</template>

<script>
import ListElementDescription from '@Core/components/List/ListElementDescription';
import ListElementTitle from '@Core/components/List/ListElementTitle';
import {
    getUUID,
} from '@Core/models/stringWrapper';
import {
    mapActions,
} from 'vuex';

export default {
    name: 'ConditionsListElement',
    components: {
        ListElementDescription,
        ListElementTitle,
        ListDraggableElement: () => import('@Core/components/List/ListDraggableElement'),
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
        disabled: {
            type: Boolean,
            deafulr: false,
        },
    },
    methods: {
        ...mapActions('draggable', [
            'setDraggedElement',
        ]),
        onDrag(isDragged) {
            const {
                id, name, code,
            } = this.item;
            if (isDragged) {
                this.setDraggedElement({
                    id: `${id}--${getUUID()}`,
                    name,
                    code,
                });
            } else {
                this.setDraggedElement();
            }
        },
    },
};
</script>
