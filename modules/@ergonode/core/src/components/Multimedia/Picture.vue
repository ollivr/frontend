/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <img
        ref="img"
        :style="styles"
        :class="classes"
        :src="require('@Core/assets/images/placeholders/no_image.svg')"
        alt="picture">
</template>

<script>
import {
    getImageData,
} from '@Core/models/multimedia';

export default {
    name: 'Picture',
    props: {
        value: {
            type: String,
            required: true,
        },
        apiPath: {
            type: String,
            required: true,
        },
        fab: {
            type: Boolean,
            default: false,
        },
        useCache: {
            type: Boolean,
            default: true,
        },
        objectFit: {
            type: String,
            default: 'cover',
        },
    },
    data() {
        return {
            observer: null,
            cancelToken: null,
            isLoading: true,
        };
    },
    computed: {
        classes() {
            return [
                'picture',
                {
                    'picture--fab': this.fab,
                },
            ];
        },
        styles() {
            return {
                objectFit: this.isLoading ? 'unset' : this.objectFit,
            };
        },
    },
    watch: {
        value() {
            this.getImage();
        },
    },
    mounted() {
        this.observer = new IntersectionObserver((entries) => {
            const image = entries[0];
            if (image.isIntersecting) {
                this.getImage();
                this.observer.disconnect();
            }
        });

        this.observer.observe(this.$el);
    },
    beforeDestroy() {
        if (this.cancelToken) {
            this.cancelToken.cancel();
        }
        this.observer.disconnect();
    },
    methods: {
        getImage() {
            this.cancelToken = this.$axios.CancelToken.source();

            this.$axios.$get(this.apiPath, {
                useCache: this.useCache,
                cancelToken: this.cancelToken.token,
                responseType: 'arraybuffer',
            })
                .then(response => this.onSuccess(response))
                .catch(this.imageLoadOnError);
        },
        onSuccess(response) {
            if (this.$refs.img) {
                this.$refs.img.src = getImageData(response);
            }

            this.isLoading = false;
        },
        imageLoadOnError() {
            if (this.$refs.img) {
                this.$refs.img.src = require('@Core/assets/images/placeholders/image_error.svg'); // eslint-disable-line global-require, import/no-dynamic-require
            }

            this.isLoading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
    .picture {
        width: 100%;
        max-height: 100%;

        &--fab {
            height: 100%;
            border-radius: 50%;
        }
    }
</style>
