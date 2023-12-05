import React from "react";

const SearchBar: React.FC = () => {
    return (
        <div className="w-60">
            <input
                type="text"
                placeholder="Search settings"
                className="w-full bg-gray-600 text-white p-2 rounded"
            />
        </div>
    );
};

export default SearchBar;