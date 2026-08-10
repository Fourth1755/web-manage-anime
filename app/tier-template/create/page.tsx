import Link from 'next/link';
import { CategoryUniverseService } from '../../api/categoryUniverse';
import CreateTierTemplateForm from './form';

export const dynamic = 'force-dynamic';

export default async function CreateTierTemplatePage() {
    const categoryUniverseService = new CategoryUniverseService();
    const categoryUniverses = await categoryUniverseService.getCategoryUniverse();

    return (
        <div className="container mx-auto px-5 pt-20 md:px-40">
            <div className="flex items-center justify-between py-10">
                <div>
                    <h1>Create Tier Template</h1>
                    <p className="mt-1 text-sm text-gray-500">Create a reusable tier list template</p>
                </div>
                <Link href="/tier-template" className="text-sm text-pink-500 hover:underline">Back to templates</Link>
            </div>
            <CreateTierTemplateForm categoryUniverses={categoryUniverses} />
        </div>
    );
}
