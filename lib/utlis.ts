import { PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;
export function extractPrice(...elements: any[]): string {
  for (const element of elements) {
    if (!element || element.length === 0) continue;

    const priceText = element.first().text().trim(); // Only take the first match

    if (priceText) {
      // Remove non-numeric characters except comma and dot
      const cleaned = priceText.replace(/[^\d.,]/g, '');

      // Replace commas only if dot is not present (Indian format to float)
      const normalized = cleaned.includes('.') ? cleaned.replace(/,/g, '') : cleaned.replace(/,/g, '');

      // Match only the first valid number
      const match = normalized.match(/[\d.,]+/);
      if (match) {
        // Final cleanup if needed
        const price = match[0].replace(/,/g, '');
        return price;
      }
    }
  }
  return '';
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}
export function extractReviewsCount(element: any): number {
  const text = element.text().trim().replace(/[(),]/g, ''); // Remove () and comma
  const num = parseInt(text, 10);
  return isNaN(num) ? 0 : num;
}

export function extractStars($: any) {
  const starsText = $('span.a-icon-alt').first().text().trim(); // e.g., "4.0 out of 5 stars"
  const match = starsText.match(/(\d+(\.\d+)?)/); // extracts 4.0
  return match ? parseFloat(match[1]) : 0;
}
export function extractCategory(element: any): string {
  if (!element || element.length === 0) return "";

  const categories: string[] = [];

  element.find("li a").each((_: any, el: any) => {
    const text = element.find(el).text().trim();
    if (text) categories.push(text);
  });

  return categories.join(" > ");
}



export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};