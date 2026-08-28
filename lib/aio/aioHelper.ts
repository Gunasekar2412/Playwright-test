import axios from 'axios';

export function resolveAioCycleKey(region?: string): string {
    const normalizedRegion = (region || '').trim().toLowerCase();
    let cycleKey: string | undefined;
    let envKey: string;

    if (normalizedRegion === 'jamaica') {
        envKey = 'AIO_JAMAICA_CYCLE_KEY';
        cycleKey = process.env.AIO_JAMAICA_CYCLE_KEY;
    } else if (normalizedRegion === 'barbados') {
        envKey = 'AIO_BARBADOS_CYCLE_KEY';
        cycleKey = process.env.AIO_BARBADOS_CYCLE_KEY;
    } else {
        envKey = 'AIO_CYCLE_KEY';
        cycleKey = process.env.AIO_CYCLE_KEY;
    }

    if (!cycleKey?.trim()) {
        throw new Error(
            `${envKey} must be set to the AIO execution cycle key.`
        );
    }

    return cycleKey.trim();
}

export async function addCommentToTestCase(
    testCaseKey: string,
    comment: string,
    options: { cycleKey?: string; region?: string } = {}
) {
    try {
        const cycleKey =
            options.cycleKey || resolveAioCycleKey(options.region);

        const url =
            `https://tcms.aiojiraapps.com/aio-tcms/api/v1/project/${process.env.AIO_PROJECT_KEY}/testcycle/${cycleKey}/testcase/${testCaseKey}/comment`;

        const response = await axios.post(
            url,
            {
                comment
            },
            {
                headers: {
                    Authorization:
                        `AioAuth ${process.env.AIO_API_TOKEN}`,
                        'Content-Type': 'application/json'
                }
            }
        );
        return response.data;

    } catch (error: any) {  }
}
