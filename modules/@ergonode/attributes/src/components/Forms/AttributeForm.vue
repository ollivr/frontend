/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Form
        title="Options"
        :fields-keys="[
            codeFieldKey,
            typeFieldKey,
            groupsFieldKey,
            scopeFieldKey,
            paramsFieldKey,
            ...optionsFieldKeys,
        ]">
        <template #body="{ errorMessages }">
            <FormSection>
                <TextField
                    :data-cy="dataCyGenerator(codeFieldKey)"
                    :value="code"
                    required
                    :error-messages="errorMessages[codeFieldKey]"
                    :disabled="isDisabled || !isAllowedToUpdate"
                    label="System name"
                    hint="System name must be unique"
                    @input="setCodeValue" />
                <TranslationLazySelect
                    :data-cy="dataCyGenerator(groupsFieldKey)"
                    :value="groups"
                    label="Groups"
                    :multiselect="true"
                    :clearable="true"
                    :disabled="!isAllowedToUpdate"
                    :error-messages="errorMessages[groupsFieldKey]"
                    :fetch-options-request="getAttributeGroupOptionsRequest"
                    @input="setGroupsValue" />
                <Select
                    :data-cy="dataCyGenerator(typeFieldKey)"
                    :value="type"
                    required
                    label="Type"
                    :disabled="isDisabled || !isAllowedToUpdate"
                    :options="attributeTypeOptions"
                    :error-messages="errorMessages[typeFieldKey]"
                    @input="onTypeChange" />
            </FormSection>
            <Divider />
            <FormSection title="Configuration">
                <Select
                    :data-cy="dataCyGenerator(scopeFieldKey)"
                    :value="scope"
                    required
                    label="Scope"
                    :disabled="!isAllowedToUpdate"
                    :options="attributeScopeOptions"
                    :error-messages="errorMessages[scopeFieldKey]"
                    @input="setScopeValue">
                    <template #append>
                        <InfoHint :hint="scopeHint" />
                    </template>
                </Select>
                <Select
                    v-if="hasParams"
                    :data-cy="dataCyGenerator('params')"
                    key="attrHasParams"
                    :value="parameter"
                    required
                    :label="paramsLabel"
                    :options="attributeParametersOptions"
                    :error-messages="errorMessages[paramsFieldKey]"
                    :disabled="!isAllowedToUpdate"
                    @input="setParameterValue" />
                <AttributeOptionKeyValues
                    v-show="hasOptions"
                    key="attrHasOptions"
                    :disabled="!isAllowedToUpdate" />
                <Toggler
                    v-if="isTextArea"
                    :value="parameter"
                    label="Rich text content enabled"
                    @input="setParameterValue" />
            </FormSection>
        </template>
    </Form>
</template>

<script>
import PRIVILEGES from '@Attributes/config/privileges';
import {
    SCOPE,
    TYPES,
} from '@Attributes/defaults/attributes';
import {
    getParamsKeyForType,
    getParamsOptionsForType,
    hasOptions,
    hasParams,
} from '@Attributes/models/attributeTypes';
import {
    getKeyByValue,
} from '@Core/models/objectWrapper';
import {
    toCapitalize,
} from '@Core/models/stringWrapper';
import {
    mapActions,
    mapGetters,
    mapState,
} from 'vuex';

const getAttributeGroupsOptions = () => import('@Attributes/services/getAttributeGroupsOptions.service');

export default {
    name: 'AttributeForm',
    components: {
        AttributeOptionKeyValues: () => import('@Attributes/components/Forms/Sections/AttributeOptionKeyValues'),
        Form: () => import('@Core/components/Form/Form'),
        FormSection: () => import('@Core/components/Form/Section/FormSection'),
        InfoHint: () => import('@Core/components/Hints/InfoHint'),
        TextField: () => import('@Core/components/Inputs/TextField'),
        Select: () => import('@Core/components/Inputs/Select/Select'),
        Toggler: () => import('@Core/components/Inputs/Toggler/Toggler'),
        TranslationLazySelect: () => import('@Core/components/Inputs/Select/TranslationLazySelect'),
        Divider: () => import('@Core/components/Dividers/Divider'),
    },
    computed: {
        ...mapState('authentication', {
            userLanguageCode: state => state.user.language,
        }),
        ...mapState('attribute', {
            attrID: state => state.id,
            code: state => state.code,
            options: state => state.options,
            groups: state => state.groups,
            type: state => state.type,
            parameter: state => state.parameter,
            scope: state => state.scope,
        }),
        ...mapState('dictionaries', {
            attrTypes: state => state.attrTypes,
        }),
        ...mapGetters('core', [
            'rootLanguage',
        ]),
        scopeHint() {
            return `Global means the same attribute values for each language, inherited from the root language (${this.rootLanguage.name}). Option values can be translated, but cannot be changed in the product template.`;
        },
        paramsLabel() {
            const paramsKey = getParamsKeyForType(this.typeKey);

            return toCapitalize(paramsKey);
        },
        isDisabled() {
            return Boolean(this.attrID);
        },
        isAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.ATTRIBUTE.update,
            ]);
        },
        isTextArea() {
            return this.typeKey === TYPES.TEXT_AREA;
        },
        hasParams() {
            return hasParams(this.typeKey);
        },
        typeKey() {
            return getKeyByValue(this.attrTypes, this.type);
        },
        params() {
            return getParamsOptionsForType(
                this.typeKey,
                this.$store.state.dictionaries,
            );
        },
        hasOptions() {
            return hasOptions(this.typeKey);
        },
        attributeTypeOptions() {
            return Object.values(this.attrTypes).sort();
        },
        attributeScopeOptions() {
            return Object.values(SCOPE);
        },
        attributeParametersOptions() {
            // TODO:(DICTIONARY_TYPE) remove condition when dictionary data consistency
            if (Array.isArray(this.params)) {
                return this.params.map(data => data.name);
            }
            return Object.values(this.params);
        },
        optionsFieldKeys() {
            return Object.keys(this.options).map(key => `code_${key}`);
        },
        codeFieldKey() {
            return 'code';
        },
        typeFieldKey() {
            return 'type';
        },
        groupsFieldKey() {
            return 'group';
        },
        scopeFieldKey() {
            return 'scope';
        },
        paramsFieldKey() {
            return `parameters_${this.paramsLabel.toLowerCase()}`;
        },
    },
    methods: {
        ...mapActions('attribute', [
            '__setState',
            'removeAttributeOptions',
        ]),
        setCodeValue(value) {
            this.__setState({
                key: 'code',
                value,
            });
        },
        setScopeValue(value) {
            this.__setState({
                key: 'scope',
                value,
            });
        },
        setGroupsValue(value) {
            this.__setState({
                key: 'groups',
                value,
            });
        },
        setTypeValue(value) {
            this.__setState({
                key: 'type',
                value,
            });
        },
        setParameterValue(value = null) {
            this.__setState({
                key: 'parameter',
                value,
            });
        },
        dataCyGenerator(key) {
            return `attribute-${key}`;
        },
        getAttributeGroupOptionsRequest() {
            return getAttributeGroupsOptions().then(response => response.default(
                {
                    $axios: this.$axios,
                    $store: this.$store,
                },
            ));
        },
        onTypeChange(type) {
            this.setTypeValue(type);
            this.setParameterValue();

            if (!this.hasOptions) {
                this.removeAttributeOptions();
            }
        },
    },
};
</script>
