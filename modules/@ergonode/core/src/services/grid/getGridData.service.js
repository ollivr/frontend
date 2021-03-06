/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    getSortedColumnsByIDs,
} from '@Core/models/mappers/gridDataMapper';
import {
    getMappedObjectOptions,
} from '@Core/models/mappers/translationsMapper';

export const getGridData = ({
    $axios,
    path,
    params,
}) => $axios
    .$get(path, {
        params,
    })
    .then(({
        collection,
        columns,
        info: {
            filtered,
        },
    }) => {
        const sortedColumns = params.columns
            ? getSortedColumnsByIDs(columns, params.columns)
            : columns;

        return {
            columns: sortedColumns,
            rows: collection,
            filtered,
        };
    });

export const getAdvancedFiltersData = ({
    $axios,
    $addAlert,
    path,
    params,
}) => $axios
    .$get(path, {
        params,
    })
    .then(({
        columns,
    }) => {
        const {
            length,
        } = columns;
        const advancedFilters = [];

        for (let i = 0; i < length; i += 1) {
            const {
                id,
                element_id,
                language,
                filter,
                label,
                parameters,
            } = columns[i];

            if (filter) {
                const mappedFilter = {
                    id,
                    attributeId: element_id || '',
                    languageCode: language,
                    type: filter.type,
                    label,
                    parameters,
                };

                if (filter.options) {
                    mappedFilter.options = getMappedObjectOptions({
                        options: filter.options,
                        languageCode: language,
                    });
                }

                advancedFilters.push(mappedFilter);
            } else {
                $addAlert({
                    type: ALERT_TYPE.ERROR,
                    message: 'Attribute has no filter',
                });
            }
        }

        return advancedFilters;
    });
