import axios from "axios";
import https from "https";

import * as cheerio from "cheerio"
import { extractCategory, extractCurrency, extractDescription, extractPrice, extractReviewsCount, extractStars } from "../utlis";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return null; // Return null instead of undefined
  
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335

  const session_id = (1000000 * Math.random()) | 0
  const options = {
    proxy: {
      protocol: "http",
      host: "brd.superproxy.io",
      port: port,
      auth: {
        username: `${username}-session-${session_id}`,
        password: password,
      },
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
  }

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();

    const currentPriceRaw = extractPrice(
      $(".priceToPay .a-offscreen"),
      $(".priceToPay .a-price-whole"),
      $("#tp_price_block_total_price_in .a-price-whole"),
      $(".a-price .a-offscreen"),
      $(".a-price .a-price-whole")
    );

    const originalPriceRaw = extractPrice(
      $(".a-text-price .a-offscreen")
    );

    // Convert to numbers and validate
    const currentPrice = parseFloat(currentPriceRaw?.replace(/[^\d.-]/g, '') || '0');
    const originalPrice = parseFloat(originalPriceRaw?.replace(/[^\d.-]/g, '') || '0');

    // If no valid prices found, return null
    if (isNaN(currentPrice) && isNaN(originalPrice)) {
      console.warn(`No valid prices found for product: ${url}`);
      return null;
    }

    // Use the valid price or fallback
    const validCurrentPrice = !isNaN(currentPrice) && currentPrice > 0 ? currentPrice : originalPrice;
    const validOriginalPrice = !isNaN(originalPrice) && originalPrice > 0 ? originalPrice : currentPrice;

    const outOfStock = $("#availability").text().toLowerCase().includes("unavailable");

    const images = $("#landingImage").attr("data-a-dynamic-image") || $("#imgBlkFront").attr("data-a-dynamic-image") || '{}';
    let imageUrls: string[] = [];
    
    try {
      imageUrls = Object.keys(JSON.parse(images));
    } catch (e) {
      console.warn('Failed to parse images JSON');
      imageUrls = [];
    }

    const currency = extractCurrency($(".a-price-symbol"));

    const discountText = $('.savingsPercentage').first().text().trim();
    const discountRate = discountText.replace(/[-%]/g, '');

    const reviewsCount = extractReviewsCount($('#acrCustomerReviewText'));
    const stars = extractStars($);
    const description = extractDescription($);
    const category = extractCategory($('ul.a-unordered-list.a-horizontal.a-size-small'));

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0] || '',
      title: title || 'Unknown Product',
      currentPrice: validCurrentPrice,
      originalPrice: validOriginalPrice,
      priceHistory: [],
      discountRate: Number(discountRate) || 0,
      category: category || 'category',
      reviewsCount: reviewsCount || 0,
      stars: stars || 0,
      isOutOfStock: outOfStock,
      description: description || '',
      lowestPrice: validCurrentPrice,
      highestPrice: validOriginalPrice,
      averagePrice: validCurrentPrice,
    }
    
    return data;
  }
  catch (error: any) {
    console.error(`Failed to scrape product ${url}:`, error.message);
    return null; // Return null instead of throwing
  }
}