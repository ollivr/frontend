/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <img
        ref="img"
        :style="imageStyle"
        :class="[
            'image',
            {
                'image--fab': fab,
            }
        ]"
        :src="require('@Core/assets/images/placeholders/no_image.svg')"
        alt="picture">
</template>

<script>
import {
    getImageData,
} from '@Core/models/multimedia';
import {
    mapActions,
} from 'vuex';

export default {
    name: 'Picture',
    props: {
        imageId: {
            type: String,
            required: true,
        },
        fab: {
            type: Boolean,
            default: false,
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
        imageStyle() {
            return {
                objectFit: this.isLoading ? 'unset' : this.objectFit,
            };
        },
    },
    watch: {
        imageId() {
            this.getImageById();
        },
    },
    mounted() {
        this.observer = new IntersectionObserver((entries) => {
            const image = entries[0];
            if (image.isIntersecting) {
                this.getImageById();
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
        ...mapActions('validations', [
            'onError',
        ]),
        getImageById() {
            this.cancelToken = this.$axios.CancelToken.source();

            this.$axios.$get(`multimedia/${this.imageId}`, {
                useCache: true,
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
    .image {
        max-height: 100%;

        &:not(&--fab) {
            width: 100%;
        }

        &--fab {
            border-radius: 50%;
        }
    }
</style>