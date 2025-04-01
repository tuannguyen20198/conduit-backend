export class APIError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Hàm xử lý lỗi API
export const handleAPIError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new APIError(
      errorData.message || "Something went wrong",
      response.status,
      errorData
    );
  }
  return response.json();
};
