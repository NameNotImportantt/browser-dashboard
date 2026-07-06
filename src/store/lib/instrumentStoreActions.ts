import {trackStoreActionFailure, trackStoreActionStart, trackStoreActionSuccess} from '@/app/bootstrap/devPerformance';

type StoreActionResult = Promise<string | null | void> | string | null | void;

type StoreActionArg = boolean | File | null | number | object | string | undefined;

type StoreAction = (...args: StoreActionArg[]) => StoreActionResult;

export function instrumentStoreActions<TStore extends object>(store: TStore) {
    const instrumentedStore = {...store};

    for (const [storeEntryKey, storeEntryValue] of Object.entries(store)) {
        if (typeof storeEntryValue !== 'function') {
            continue;
        }

        const actionName = storeEntryKey;
        const originalAction = storeEntryValue as StoreAction;

        const instrumentedAction: StoreAction = (...args) => {
            const startedAt = trackStoreActionStart();

            try {
                const actionResult = originalAction(...args);

                if (actionResult instanceof Promise) {
                    return actionResult
                        .then(result => {
                            trackStoreActionSuccess(actionName, startedAt);
                            return result;
                        })
                        .catch(error => {
                            trackStoreActionFailure(actionName, startedAt);
                            throw error;
                        });
                }

                trackStoreActionSuccess(actionName, startedAt);
                return actionResult;
            } catch (error) {
                trackStoreActionFailure(actionName, startedAt);
                throw error;
            }
        };

        Object.assign(instrumentedStore, {
            [storeEntryKey]: instrumentedAction,
        });
    }

    return instrumentedStore;
}
