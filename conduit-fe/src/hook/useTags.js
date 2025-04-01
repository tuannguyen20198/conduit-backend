import { useQuery } from "@tanstack/react-query";
import { getTags } from "@/lib/api";
export const useTags = () => {
    return useQuery({
        queryKey: ["tags"],
        queryFn: getTags,
        initialData: { tags: [] },
    });
};
