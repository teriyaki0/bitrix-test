import { productService } from "./product.service";
import { HttpError } from "../../middlewares/error-handler";
import axios from "axios";
import { config } from "../../config";
import { SECTIONS_ID } from "../../constants/bitrix-section.const";
import { HTTP_STATUS_CODE } from "../../constants/http-status-code.enum";
import { DEAL_ERROR } from "../../constants/messages/deal-messages.const";
import { ProductWithQuantity } from "../../interfaces/bitrix";

interface DealInput {
  device: { productId: number; quantity: number };
  parts?: { productId: number; quantity: number }[];
  services?: { productId: number; quantity: number }[];
}

export class DealService {
  private webhookUrl = config.bitrix.webhook;

  async createDeal(data: DealInput) {
    const device = await productService.getProductById(SECTIONS_ID.devices, data.device.productId);

    if (!device) throw new HttpError(HTTP_STATUS_CODE.NOT_FOUND, DEAL_ERROR.DEVICE_NOT_FOUND);
    if (data.device.quantity < 1) throw new HttpError(HTTP_STATUS_CODE.BAD_REQUEST, DEAL_ERROR.INVALID_QUANTITY);

    const parts: ProductWithQuantity[] = [];
    for (const partData of data.parts || []) {
      const part = await productService.getProductById(SECTIONS_ID.parts, partData.productId);
      if (!part) throw new HttpError(HTTP_STATUS_CODE.NOT_FOUND, DEAL_ERROR.PART_NOT_FOUND(partData.productId));
      if (part.price === null) throw new HttpError(HTTP_STATUS_CODE.BAD_REQUEST, DEAL_ERROR.NO_PRICE(partData.productId));
      if (partData.quantity < 1) throw new HttpError(HTTP_STATUS_CODE.BAD_REQUEST, DEAL_ERROR.INVALID_QUANTITY);
      parts.push({ ...part, quantity: partData.quantity });
    }

    const services: ProductWithQuantity[] = [];
    for (const serviceData of data.services || []) {
      const service = await productService.getProductById(SECTIONS_ID.services, serviceData.productId);
      if (!service) throw new HttpError(HTTP_STATUS_CODE.NOT_FOUND, DEAL_ERROR.SERVICE_NOT_FOUND(serviceData.productId));
      if (service.price === null) throw new HttpError(HTTP_STATUS_CODE.BAD_REQUEST, DEAL_ERROR.NO_PRICE(serviceData.productId));
      if (serviceData.quantity < 1) throw new HttpError(HTTP_STATUS_CODE.BAD_REQUEST, DEAL_ERROR.INVALID_QUANTITY);
      services.push({ ...service, quantity: serviceData.quantity });
    }

    const title = `Работы ${device.name}`;
    const allRows = [{ ...device, quantity: data.device.quantity }, ...parts, ...services];

    const total = allRows.reduce((sum, row) => sum + (row.price || 0) * row.quantity, 0);

    try {
      const { data: dealData } = await axios.post(`${this.webhookUrl}/crm.deal.add`, {
        fields: {
          TITLE: title,
          OPPORTUNITY: total,
          CURRENCY_ID: allRows.find((r) => r.currency)?.currency || "KZT",
          STAGE_ID: "NEW",
        },
      });

      const dealId = dealData.result;

      const rows = allRows.map((r) => ({
        PRODUCT_ID: r.id,
        PRICE: r.price,
        QUANTITY: r.quantity,
      }));

      await axios.post(`${this.webhookUrl}/crm.deal.productrows.set`, {
        id: dealId,
        rows,
      });

      return {
        ok: true,
        dealId,
        title,
        rowsAdded: allRows.length,
        total,
      };
    } catch (err: any) {
      throw new HttpError(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, err.response?.data?.error_description || DEAL_ERROR.CREATE_FAILED);
    }
  }
}

export const dealService = new DealService();
