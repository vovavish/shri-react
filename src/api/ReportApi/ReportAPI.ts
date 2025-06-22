export class ReportAPI {
  static BASE_URL = 'http://localhost:3000';

  static async getReport(size: number, withErrors: 'off' | 'on' = 'off', maxSpend = 1000) {
    return await fetch(
      `${this.BASE_URL}/report?size=${size}&withErrors=${withErrors}&maxSpend=${maxSpend}`,
      {
        method: 'GET',
      },
    );
  }

  static async aggregate(file: File, rows: number) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.BASE_URL}/aggregate?rows=${rows}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok || !response.body) {
      throw new Error(response.statusText);
    }

    return response.body?.getReader();
  }
}
