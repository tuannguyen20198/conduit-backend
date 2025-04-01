export class APIError extends Error {
    status;
    data;
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }
}
// Hàm xử lý lỗi API
export const handleAPIError = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new APIError(errorData.message || "Something went wrong", response.status, errorData);
    }
    return response.json();
};
