/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Page>
        <TitleBar
            :title="title"
            :is-read-only="isReadOnly">
            <template #prependHeader>
                <NavigationBackFab />
            </template>
            <template #mainAction>
                <Button
                    data-cy="delete-attribute-group"
                    :theme="secondaryTheme"
                    :size="smallSize"
                    title="REMOVE GROUP"
                    :disabled="!isAllowedToDelete"
                    @click.native="onRemove">
                    <template #prepend="{ color }">
                        <IconDelete :fill-color="color" />
                    </template>
                </Button>
            </template>
        </TitleBar>
        <HorizontalRoutingTabBar :items="tabs" />
        <Footer flex-end>
            <Button
                data-cy="save-attribute-group"
                title="SAVE GROUP"
                :size="smallSize"
                :disabled="$isLoading('footerButton')"
                @click.native="onSave" />
        </Footer>
    </Page>
</template>

<script>
import PRIVILEGES from '@Attributes/config/privileges';
import editPageMixin from '@Core/mixins/page/editPageMixin';

export default {
    name: 'AttributeGroupPage',
    mixins: [
        editPageMixin,
    ],
    computed: {
        isAllowedToDelete() {
            return this.$hasAccess([
                PRIVILEGES.ATTRIBUTE_GROUP.delete,
            ]);
        },
        isReadOnly() {
            return this.$isReadOnly(PRIVILEGES.ATTRIBUTE_GROUP.namespace);
        },
    },
};
</script>
