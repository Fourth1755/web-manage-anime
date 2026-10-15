"use server";

import { revalidatePath } from 'next/cache';
import { isAxiosError } from 'axios';
import type { CreateTierTemplateRequest, CreateTierTemplateResult, PresignTierTemplateImageRequest, PresignTierTemplateImageResult } from '@/app/api/dtos/tierTemplate';
import { TierTemplateService } from '../../api/tierTemplate';

function errorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) return 'Your admin session has expired. Please sign in again.';
        if (status && status < 500 && typeof error.response?.data?.message === 'string') return error.response.data.message;
    }
    return 'Unable to connect to the anime service. Please try again.';
}

export async function presignTierTemplateImage(request: PresignTierTemplateImageRequest): Promise<PresignTierTemplateImageResult> {
    try {
        const upload = await new TierTemplateService().presignImageUpload(request);
        return { ok: true, upload };
    } catch (error: unknown) {
        return { ok: false, error: errorMessage(error) };
    }
}

export async function createTierTemplate(request: CreateTierTemplateRequest): Promise<CreateTierTemplateResult> {
    try {
        await new TierTemplateService().createTierTemplate(request);
        revalidatePath('/tier-template');
        return { ok: true };
    } catch (error: unknown) {
        return { ok: false, error: errorMessage(error) };
    }
}
