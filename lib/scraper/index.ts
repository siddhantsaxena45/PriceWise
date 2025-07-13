import axios from "axios";
import https from "https";

import * as cheerio from "cheerio"
import { extractCategory, extractCurrency, extractDescription, extractPrice, extractReviewsCount, extractStars } from "../utlis";
export async function scrapeAmazonProduct(url: string) {
  if (!url) return
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
      rejectUnauthorized: false, // optional: suppress SSL cert errors
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

    const currentPrice = extractPrice(
      $(".priceToPay .a-offscreen"),
      $(".priceToPay .a-price-whole"),
      $("#tp_price_block_total_price_in .a-price-whole"),
      $(".a-price .a-offscreen"),
      $(".a-price .a-price-whole")
    );


    const originalPrice = extractPrice(
      $(".a-text-price .a-offscreen")
    );
    const outOfStock = $("#availability").text().toLowerCase().includes("unavailable");

    const images = $("#landingImage").attr("data-a-dynamic-image") || $("#imgBlkFront").attr("data-a-dynamic-image") || '{}';
    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discountText = $('.savingsPercentage').first().text().trim(); // e.g. "-31%"
    const discountRate = discountText.replace(/[-%]/g, ''); // "31"

    const reviewsCount = extractReviewsCount($('#acrCustomerReviewText'));
    const stars = extractStars($);

    const description = extractDescription($)
const category = extractCategory($('ul.a-unordered-list.a-horizontal.a-size-small'));

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category:category || 'category',
      reviewsCount,
      stars,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }
    
    return data;
  }
  catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`)

  }
}