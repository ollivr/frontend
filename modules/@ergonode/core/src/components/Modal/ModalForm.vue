/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ModalOverlay @close="onClose">
        <Modal data-cy="modal">
            <ModalHeader
                :title="title"
                @close="onClose">
                <template #prepend>
                    <slot name="prependHeader" />
                </template>
            </ModalHeader>
            <ModalBody>
                <slot name="body" />
            </ModalBody>
            <ModalFooter>
                <slot name="footer" />
            </ModalFooter>
        </Modal>
    </ModalOverlay>
</template>

<script>
import Modal from '@Core/components/Modal/Modal';
import ModalBody from '@Core/components/Modal/ModalBody';
import ModalFooter from '@Core/components/Modal/ModalFooter';
import ModalHeader from '@Core/components/Modal/ModalHeader';
import ModalOverlay from '@Core/components/Modal/ModalOverlay';

export default {
    name: 'ModalForm',
    components: {
        Modal,
        ModalFooter,
        ModalBody,
        ModalHeader,
        ModalOverlay,
    },
    props: {
        title: {
            type: String,
            default: '',
        },
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
    },
};
</script>
