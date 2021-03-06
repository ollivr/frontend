/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ModalGrid
        title="Export details"
        :api-path="channelGridPath"
        @close="onClose">
        <template #headerActions>
            <div class="export-details-tiles">
                <Tile
                    v-for="(detail, index) in details"
                    :key="index"
                    :label="detail.label"
                    :value="detail.value" />
            </div>
        </template>
        <template #appendFooter>
            <Button
                v-if="downloadLink"
                title="DOWNLOAD FILE"
                :size="smallSize"
                :disabled="!isUserAllowedToUpdate"
                @click.native="onDownloadExportFile" />
        </template>
    </ModalGrid>
</template>

<script>
import PRIVILEGES from '@Channels/config/privileges';
import Button from '@Core/components/Button/Button';
import ModalGrid from '@Core/components/Modal/ModalGrid';
import Tile from '@Core/components/Tile/Tile';
import {
    SIZE,
} from '@Core/defaults/theme';
import {
    mapState,
} from 'vuex';

export default {
    name: 'ExportDetailsModalGrid',
    components: {
        ModalGrid,
        Tile,
        Button,
    },
    props: {
        channelId: {
            type: String,
            required: true,
        },
        exportId: {
            type: String,
            required: true,
        },
    },
    async fetch() {
        await this.getExportDetails();
    },
    data() {
        return {
            details: [],
            downloadLink: '',
        };
    },
    computed: {
        ...mapState('channels', {
            type: state => state.type,
        }),
        ...mapState('authentication', {
            languageCode: state => state.user.language,
        }),
        isUserAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.CHANNEL.update,
            ]);
        },
        isReadOnly() {
            return this.$isReadOnly(PRIVILEGES.CHANNEL.namespace);
        },
        smallSize() {
            return SIZE.SMALL;
        },
        channelGridPath() {
            return `${this.languageCode}/channels/${this.channelId}/exports/${this.exportId}/errors`;
        },
    },
    methods: {
        onDownloadExportFile() {
            this.$axios.$get(this.downloadLink, {
                responseType: 'arraybuffer',
            })
                .then((response) => {
                    const downloadUrl = window.URL.createObjectURL(new Blob([
                        response,
                    ]));
                    const link = document.createElement('a');

                    link.href = downloadUrl;
                    link.setAttribute('download', `export_${this.type}_${this.details[1].value}.zip`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                });
        },
        onClose() {
            this.$emit('close');
        },
        async getExportDetails() {
            const details = await this.$axios.$get(`${this.languageCode}/channels/${this.channelId}/exports/${this.exportId}`);

            this.details = [
                {
                    label: 'Date of start',
                    value: details.started_at,
                },
                {
                    label: 'Date of finish',
                    value: details.ended_at,
                },
                {
                    label: 'Status',
                    value: details.status,
                },
                {
                    label: 'Processed',
                    value: details.processed || '0',
                },
                {
                    label: 'Errors',
                    value: details.errors || '0',
                },
            ];

            if (details._links && details._links.attachment) {
                this.downloadLink = details._links.attachment.href;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    .export-details-tiles {
        display: flex;
        flex-wrap: wrap;

        & > * {
            margin-right: 12px;
        }
    }
</style>
