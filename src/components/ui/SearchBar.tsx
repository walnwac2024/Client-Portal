import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query); // Pass the search query back to the parent component
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by username, email, etc."
        value={searchQuery}
        onChange={handleSearch}
        className="px-4 py-2 border border-gray-300 rounded-lg w-full hover:border-red-900"
      />
    </div>
  );
};

export default SearchBar;
