import React, {Fragment} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import {useModels} from "../hooks/useModels.ts";

interface ModelSelectProps {}

const ModelSelect: React.FC<ModelSelectProps> = ({}) => {
    const { availableModels, selectModel, selectedModel } = useModels();

    const handleChange = (model: string) => {
        selectModel(model);
    };

    return (
        <Listbox as="div" className="relative w-48" value={selectedModel} onChange={handleChange}>
            <div className="mt-1">
                <Listbox.Button className="flex justify-between w-full text-white bg-transparent border border-white border-opacity-50 pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-white focus:border-white sm:text-sm">
                    <span className="block truncate">{selectedModel}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>
            </div>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {availableModels.map((model) => (
                        <Listbox.Option
                            key={model}
                            className={({ active }) =>
                                `cursor-default select-none relative py-2 pl-3 pr-3 ${
                                    active ? 'text-white bg-amber-600' : 'text-amber-900'
                                }`
                            }
                            value={model}
                        >
                            {model}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Transition>
        </Listbox>
    );
};

export default ModelSelect;
