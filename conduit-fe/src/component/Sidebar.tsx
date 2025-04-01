import React from "react";

const Sidebar = ({ tags, selectedTags, setSelectedTags }: any) => {
  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags: string[]) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag) // Bỏ tag nếu đã chọn
        : [...prevTags, tag] // Thêm tag nếu chưa chọn
    );
  };

  return (
    <div className="sidebar p-4 bg-white rounded-2xl">
      <p className="text-lg font-semibold mb-3">Popular Tags</p>
      <div className="flex flex-wrap gap-2">
        {tags?.tags?.length > 0 ? (
          tags?.tags.map((tag: string) => (
            <span
              key={tag}
              className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                          ${selectedTags.includes(tag)
                              ? "bg-[#5eb85f] text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-[#5eb85f] hover:text-white hover:shadow-lg"
                          }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))
        ) : (
          <p className="text-gray-500">No tags available</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
