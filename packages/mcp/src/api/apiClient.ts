export class ApiClient {
  private baseURL: string;
  constructor() {
    this.baseURL = process.env.GCPD_API_ORIGIN as string;
  }

  async fetch<T>(path: string | URL | Request, fetchOptions: RequestInit = {}): Promise<T> {
    const response = await fetch(this.baseURL + path, fetchOptions);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(errorMessage);
    }

    const responseAsText = await response.text();
    const responseAsTextReplaced = responseAsText.replaceAll('http://localhost:3000', process.env.MCP_ORIGIN as string);

    return JSON.parse(responseAsTextReplaced);
  }
}
