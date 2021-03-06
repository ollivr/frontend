/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */

<template>
    <Form
        :title="schema.title"
        :fields-keys="fieldsKeys">
        <template #body="{ errorMessages }">
            <Component
                v-for="element in schemaComponents"
                :key="element.key"
                :is="element.component"
                :value="model[element.key]"
                :schema="element.props"
                :error-messages="errorMessages[element.key]"
                @input="onValueChange" />
        </template>
    </Form>
</template>

<script>
import Form from '@Core/components/Form/Form';
import {
    toCapitalize,
} from '@Core/models/stringWrapper';

export default {
    name: 'JSONSchemaForm',
    components: {
        Form,
    },
    props: {
        schema: {
            type: Object,
            default: () => ({
                properties: {},
                required: [],
            }),
        },
        value: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            model: {},
            schemaComponents: [],
        };
    },
    computed: {
        fieldsKeys() {
            if (typeof this.schema.properties === 'undefined') {
                return [];
            }

            return Object.keys(this.schema.properties);
        },
    },
    watch: {
        schema: {
            immediate: true,
            handler() {
                this.schemaComponents = this.getComponents();
                this.model = JSON.parse(this.value);
            },
        },
    },
    methods: {
        getComponents() {
            const {
                length,
            } = this.fieldsKeys;
            const components = [];

            for (let i = 0; i < length; i += 1) {
                const key = this.fieldsKeys[i];
                const {
                    type, ...rest
                } = this.schema.properties[key];

                components.push({
                    key,
                    props: {
                        isRequired: this.schema.required
                            && this.schema.required.indexOf(key) !== -1,
                        ...rest,
                    },
                    component: () => import(`@Core/components/Form/JSONSchemaForm/JSONSchemaForm${toCapitalize(type)}`),
                });
            }
            return components;
        },
        onValueChange({
            key, value,
        }) {
            this.model[key] = value;
            this.$emit('input', JSON.stringify(this.model));
        },
    },
};
</script>
