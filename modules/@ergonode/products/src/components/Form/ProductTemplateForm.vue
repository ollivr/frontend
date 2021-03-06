/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <TemplateGridDesigner
        :row-height="templateRowHeight"
        :max-row="maxRows">
        <div
            class="product-template-grid"
            :style="gridTemplateRows">
            <Component
                v-for="(formField, index) in formFieldComponents"
                :is="formField"
                :key="index"
                v-bind="{
                    ...elements[index],
                    disabled: !isUserAllowedToUpdate(elements[index].properties.scope),
                    languageCode: language.code,
                }"
                @input="onValueChange" />
        </div>
    </TemplateGridDesigner>
</template>

<script>
import {
    SCOPE,
} from '@Attributes/defaults/attributes';
import {
    capitalizeAndConcatenationArray,
} from '@Core/models/stringWrapper';
import PRIVILEGES from '@Products/config/privileges';
import TemplateGridDesigner from '@Templates/components/Template/Base/TemplateGridDesigner';
import {
    mapGetters,
    mapState,
} from 'vuex';

const updateProductDraft = () => import('@Products/services/updateProductDraft.service');

export default {
    name: 'ProductTemplateForm',
    components: {
        TemplateGridDesigner,
    },
    props: {
        language: {
            type: Object,
            required: true,
        },
        elements: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            formFieldComponents: [],
        };
    },
    computed: {
        ...mapState('authentication', {
            user: state => state.user,
        }),
        ...mapGetters('core', [
            'rootLanguage',
        ]),
        templateRowHeight() {
            return 40;
        },
        maxRows() {
            const heights = this.elements.map(({
                position, size,
            }) => position.y + size.height);

            if (heights) {
                return Math.max(...heights);
            }

            return 0;
        },
        gridTemplateRows() {
            return {
                gridTemplateRows: `repeat(${this.maxRows}, ${this.templateRowHeight}px)`,
            };
        },
    },
    created() {
        this.formFieldComponents = this.elements.map(({
            type,
        }) => () => import(`@Products/components/Form/Field/ProductTemplateForm${capitalizeAndConcatenationArray(type.split('_'))}Field`));
    },
    methods: {
        isUserAllowedToUpdate(scope) {
            const {
                languagePrivileges,
            } = this.user;
            const {
                code,
            } = this.language;

            return this.$hasAccess([
                PRIVILEGES.PRODUCT.update,
            ])
                && languagePrivileges[code].edit
                && (this.rootLanguage.code === code || scope === SCOPE.LOCAL);
        },
        onValueChange(payload) {
            updateProductDraft().then(async (response) => {
                await response.default({
                    $axios: this.$axios,
                    $store: this.$store,
                    ...payload,
                });

                this.$emit('valueUpdated');
            });
        },
    },
};
</script>

<style lang="scss" scoped>
    .product-template-grid {
        display: grid;
        grid-gap: 24px;
        grid-template-columns: repeat(4, 1fr);
        width: 1008px;
        padding: 24px;
    }
</style>
