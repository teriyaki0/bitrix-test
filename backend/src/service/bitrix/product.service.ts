import axios from "axios";
import { config } from "../../config";
import { SECTIONS_ID } from "../../constants/bitrix-section.const";
import { Product } from "./health.service";

export class ProductService {
  private webhookUrl = config.bitrix.webhook;

  private async searchProducts(sectionId: number, query: string): Promise<Product[]> {
    const { data } = await axios.post(`${this.webhookUrl}/crm.product.list`, {
      filter: { SECTION_ID: sectionId, "%NAME": query },
      select: ["ID", "NAME", "PRICE", "CURRENCY_ID"],
    });

    return (
      data.result?.map((p: any) => ({
        id: Number(p.ID),
        name: p.NAME,
        price: p.PRICE ? Number(p.PRICE) : null,
        currency: p.CURRENCY_ID || null,
      })) || []
    );
  }

  searchDevices(query: string) {
    return this.searchProducts(SECTIONS_ID.devices, query);
  }

  searchParts(query: string) {
    return this.searchProducts(SECTIONS_ID.parts, query);
  }

  searchServices(query: string) {
    return this.searchProducts(SECTIONS_ID.services, query);
  }

  async getProductById(sectionId: number, productId: number): Promise<Product | null> {
    const { data } = await axios.post(`${this.webhookUrl}/crm.product.list`, {
      filter: { SECTION_ID: sectionId, ID: productId },
      select: ["ID", "NAME", "PRICE", "CURRENCY_ID"],
    });

    if (!data.result || data.result.length === 0) return null;

    const product: Product = {
      id: Number(data.result[0].ID),
      name: data.result[0].NAME,
      price: data.result[0].PRICE ? Number(data.result[0].PRICE) : null,
      currency: data.result[0].CURRENCY_ID || null,
    };

    return product;
  }
}

export const productService = new ProductService();
