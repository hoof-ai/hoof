import React from "react";
import {SettingInput, SettingToggle} from "./SettingsFields.tsx";
import { invoke } from '@tauri-apps/api/tauri';

interface SettingInfo {
    name: string;
    value: {
        [key: string]: string | number | boolean;
    };
}

const SettingsPanel: React.FC = () => {
    const [settings, setSettings] = React.useState<SettingInfo[]>([]);
    async function fetchSectionSettings(category: string, section: string) {
        try {
            const settings: SettingInfo[] = await invoke('get_section_settings', { category, section });
            console.log('Settings for section:', settings);
            setSettings(settings);
        } catch (error) {
            console.error('Error fetching section settings:', error);
        }
    }

    React.useEffect(() => {
        fetchSectionSettings('General', 'Application');
    }, []);

    return (
        <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {
                        settings.map((setting, index) => {
                            const valueObject = setting.value;
                            const  [dataType, value ] = Object.entries(valueObject)[0];
                            if (dataType == 'String' || dataType === 'Number') {
                                return <SettingInput key={index} label={setting.name} defaultValue={value as string} />;
                            } else if (dataType === 'Boolean') {
                                return <SettingToggle key={index} label={setting.name} checked={value as boolean}/>;
                            }
                        })
                    }
                </div>
                <div className="flex justify-end mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">SAVE</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded">CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;