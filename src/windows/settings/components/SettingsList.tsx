import React from "react";
import {SettingsCategory, SettingsSection} from "./SettingsCategory.tsx";
import SettingsSearchBox from "./SettingsSearchBox.tsx";
import { invoke } from '@tauri-apps/api/tauri';

interface CategorySummary {
    name: string;
    sections: string[];
}

const SettingsList: React.FC = () => {
    const [categories, setCategories] = React.useState<CategorySummary[]>([]);
    async function fetchSettingsSummary() {
        try {
            const categories: CategorySummary[] = await invoke('get_settings_summary');
            setCategories(categories);

            console.log('Settings summary fetched successfully', categories);
        } catch (error) {
            console.error('Error fetching settings summary:', error);
        }
    }

    React.useEffect(() => {
        fetchSettingsSummary();
    }, []);

    return (
        <div className="flex flex-col bg-gray-800 p-4 gap-4">
            <SettingsSearchBox/>
            {
                categories.map((category, index) => (
                    <SettingsCategory key={index} title={category.name}>
                        {
                            category.sections.map((section, index) => (
                                <SettingsSection key={index} title={section}/>
                            ))
                        }
                    </SettingsCategory>
                ))
            }
        </div>
    );
};

export default SettingsList;