/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Card :title="selectedLanguage">
        <Form :fields-keys="[nameFieldKey]">
            <template #body="{ errorMessages }">
                <FormSection>
                    <TextField
                        :data-cy="dataCyGenerator(nameFieldKey)"
                        :value="translations.name[languageCode]"
                        label="Tree name"
                        :disabled="!isUserAllowedToUpdate"
                        :error-messages="errorMessages[nameFieldKey]"
                        @input="(value) => setTranslationPropertyValue(value, 'name')" />
                </FormSection>
            </template>
        </Form>
    </Card>
</template>

<script>
import Card from '@Core/components/Card/Card';
import Form from '@Core/components/Form/Form';
import FormSection from '@Core/components/Form/Section/FormSection';
import TextField from '@Core/components/Inputs/TextField';
import translationCardMixin from '@Core/mixins/card/translationCardMixin';
import PRIVILEGES from '@Trees/config/privileges';

export default {
    name: 'CategoryTreeTranslationForm',
    components: {
        FormSection,
        Form,
        Card,
        TextField,
    },
    mixins: [
        translationCardMixin,
    ],
    computed: {
        isUserAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.CATEGORY_TREE.update,
            ]);
        },
        nameFieldKey() {
            return `name_${this.languageCode}`;
        },
    },
    methods: {
        dataCyGenerator(key) {
            return `category-tree-${key}`;
        },
    },
};
</script>
