import {db} from '@/db';

export async function runSmokeChecks() {
    if (import.meta.env?.MODE === 'production') {
        return;
    }

    try {
        if (typeof indexedDB === 'undefined') {
            console.warn('[smoke] IndexedDB недоступен в этом окружении.');
            return;
        }

        await db.open();
        await db.workspaces.count();
        console.info('[smoke] База данных инициализируется корректно.');
    } catch (error) {
        console.warn('[smoke] Базовые проверки не пройдены:', error);
    }
}
