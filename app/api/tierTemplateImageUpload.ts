import axios from 'axios';
import type { PresignTierTemplateImageRequest, PresignTierTemplateImageResult, UploadedTierTemplateImage } from '@/app/api/dtos/tierTemplate';

export const TIER_TEMPLATE_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif';
const ALLOWED_IMAGE_TYPES = new Set(TIER_TEMPLATE_IMAGE_ACCEPT.split(','));
const MAX_COVER_BYTES = 10 * 1024 * 1024;

export function validateTierTemplateCover(file: File): void {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new Error('Choose a JPEG, PNG, WebP, GIF or AVIF image.');
    }
    if (file.size === 0 || file.size > MAX_COVER_BYTES) {
        throw new Error('Choose a non-empty image up to 10 MB.');
    }
}

export class TierTemplateImageUploadService {
    public async uploadCover(
        file: File,
        requestUpload: (request: PresignTierTemplateImageRequest) => Promise<PresignTierTemplateImageResult>,
    ): Promise<UploadedTierTemplateImage> {
        validateTierTemplateCover(file);
        const contentType = file.type.trim().toLowerCase();
        const result = await requestUpload({ file_type: contentType });
        if (!result.ok) throw new Error(result.error);
        const upload = result.upload;
        if (!upload.upload_url || !upload.key || !upload.public_url) {
            throw new Error('Unable to prepare the cover image upload. Please try again.');
        }
        try {
            // The signed URL authorizes the upload; admin cookies stay on the app.
            await axios.put<void>(upload.upload_url, file, {
                headers: { 'Content-Type': contentType },
                withCredentials: false,
                timeout: 120_000,
            });
        } catch {
            throw new Error('Unable to upload the cover image. Check your connection and try again.');
        }
        return { key: upload.key, public_url: upload.public_url };
    }
}
