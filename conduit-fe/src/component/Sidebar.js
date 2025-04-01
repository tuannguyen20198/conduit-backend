import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Sidebar = ({ tags, selectedTags, setSelectedTags }) => {
    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) => prevTags.includes(tag)
            ? prevTags.filter((t) => t !== tag) // Bỏ tag nếu đã chọn
            : [...prevTags, tag] // Thêm tag nếu chưa chọn
        );
    };
    return (_jsxs("div", { className: "sidebar p-4 bg-white rounded-2xl", children: [_jsx("p", { className: "text-lg font-semibold mb-3", children: "Popular Tags" }), _jsx("div", { className: "flex flex-wrap gap-2", children: tags?.tags?.length > 0 ? (tags?.tags.map((tag) => (_jsx("span", { className: `cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                          ${selectedTags.includes(tag)
                        ? "bg-[#5eb85f] text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-[#5eb85f] hover:text-white hover:shadow-lg"}`, onClick: () => handleTagClick(tag), children: tag }, tag)))) : (_jsx("p", { className: "text-gray-500", children: "No tags available" })) })] }));
};
export default Sidebar;
