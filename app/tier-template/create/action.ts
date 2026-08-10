"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateTierTemplateRequest } from '../../api/dtos/tierTemplate';
import { TierTemplateService } from '../../api/tierTemplate';

export async function createTierTemplate(request: CreateTierTemplateRequest) {
    const tierTemplateService = new TierTemplateService();
    await tierTemplateService.createTierTemplate(request);
    revalidatePath('/tier-template');
    redirect('/tier-template');
}
