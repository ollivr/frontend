/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Card :title="selectedLanguage">
        <Form :fields-keys="[descriptionKeyField, nameKeyField]">
            <template #body="{ errorMessages }">
                <FormSection>
                    <TextField
                        :value="translations.name[languageCode]"
                        label="Status name"
                        :error-messages="errorMessages[nameKeyField]"
                        :disabled="!isUserAllowedToUpdate"
                        @input="(value) => setTranslationPropertyValue(value, 'name')" />
                    <TextArea
                        :value="translations.description[languageCode]"
                        label="Status description"
                        resize="none"
                        height="150px"
                        :error-messages="errorMessages[descriptionKeyField]"
                        :disabled="!isUserAllowedToUpdate"
                        @input="(value) => setTranslationPropertyValue(value, 'description')" />
                </FormSection>
            </template>
        </Form>
    </Card>
</template>

<script>
import Card from '@Core/components/Card/Card';
import Form from '@Core/components/Form/Form';
import FormSection from '@Core/components/Form/Section/FormSection';
import TextArea from '@Core/components/Inputs/TextArea';
import TextField from '@Core/components/Inputs/TextField';
import translationCardMixin from '@Core/mixins/card/translationCardMixin';
import PRIVILEGES from '@Transitions/config/privileges';

export default {
    name: 'ProductStatusTranslationForm',
    components: {
        FormSection,
        Form,
        Card,
        TextField,
        TextArea,
    },
    mixins: [
        translationCardMixin,
    ],
    computed: {
        isUserAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.WORKFLOW.update,
            ]);
        },
        descriptionKeyField() {
            return `description_${this.languageCode}`;
        },
        nameKeyField() {
            return `name_${this.languageCode}`;
        },
    },
};
</script>
