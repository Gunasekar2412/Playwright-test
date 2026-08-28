export type PolicyRegion = 'Barbados' | 'Jamaica';

export type PolicyEffectiveDateTime = {
    effectiveDate: string;
    effectiveTime: string;
    isoDate: string;
};

const REGION_TIME_ZONES: Record<PolicyRegion, string> = {
    Barbados: 'America/Barbados',
    Jamaica: 'America/Jamaica'
};

function getPart(
    parts: Intl.DateTimeFormatPart[],
    type: Intl.DateTimeFormatPartTypes
): string {
    const value = parts.find(part => part.type === type)?.value;

    if (!value) {
        throw new Error(`Unable to format policy date/time part: ${type}`);
    }

    return value;
}

export function getPolicyEffectiveDateTime(
    region: PolicyRegion,
    minutesBefore: number = 5,
    now: Date = new Date()
): PolicyEffectiveDateTime {
    if (!Number.isFinite(minutesBefore) || minutesBefore < 0) {
        throw new Error('minutesBefore must be a non-negative number.');
    }

    const effectiveInstant = new Date(
        now.getTime() - minutesBefore * 60_000
    );
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: REGION_TIME_ZONES[region],
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).formatToParts(effectiveInstant);

    const day = getPart(parts, 'day');
    const month = getPart(parts, 'month');
    const year = getPart(parts, 'year');
    const hour = getPart(parts, 'hour');
    const minute = getPart(parts, 'minute');
    const dayPeriod = getPart(parts, 'dayPeriod').toUpperCase();

    return {
        effectiveDate: `${day}/${month}/${year}`,
        effectiveTime: `${hour}:${minute} ${dayPeriod}`,
        isoDate: `${year}-${month}-${day}`
    };
}

export function getJamaicaEffectiveDateTime(
    minutesBefore: number = 5,
    now: Date = new Date()
): PolicyEffectiveDateTime {
    return getPolicyEffectiveDateTime('Jamaica', minutesBefore, now);
}

export function getBarbadosEffectiveDateTime(
    minutesBefore: number = 5,
    now: Date = new Date()
): PolicyEffectiveDateTime {
    return getPolicyEffectiveDateTime('Barbados', minutesBefore, now);
}
