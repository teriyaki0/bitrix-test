import axios from "axios";
import { config } from "../../config";
import { BITRIX_MESSAGE } from "../../constants/messages/bitrix-message.const";

export interface Product {
  id: number;
  name: string;
  price: number | null;
  currency: string | null;
}

class HealthService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = config.bitrix.webhook;
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.webhookUrl}/crm.status.list`);
      if (response.data && !response.data.error) {
        return { ok: true, message: BITRIX_MESSAGE.SUCCESS.HEALTH_OK };
      }

      return {
        ok: false,
        message: response.data.error_description || BITRIX_MESSAGE.ERROR.UNKNOWN,
      };
    } catch (err: any) {
      return { ok: false, message: err.message || BITRIX_MESSAGE.ERROR.CONNECTION_FAILED };
    }
  }
}

export const healthService = new HealthService();
