import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utlis";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer/indes";

export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    connectToDB();
    const products = await Product.find({});
    
    if (!products || products.length === 0) {
      return NextResponse.json({
        message: "No products found",
        data: [],
      });
    }

    // Track successful and failed updates
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        try {
          // Scrape product
          const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
          
          if (!scrapedProduct) {
            results.failed++;
            results.errors.push(`Failed to scrape: ${currentProduct.url}`);
            return currentProduct; // Return original product
          }

          // Validate that we have a valid current price
          if (!scrapedProduct.currentPrice || isNaN(scrapedProduct.currentPrice) || scrapedProduct.currentPrice <= 0) {
            results.failed++;
            results.errors.push(`Invalid price for: ${currentProduct.url}`);
            return currentProduct; // Return original product
          }

          const updatedPriceHistory = [
            ...currentProduct.priceHistory,
            {
              price: scrapedProduct.currentPrice,
            },
          ];

          const product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
          };

          // Update Products in DB
          const updatedProduct = await Product.findOneAndUpdate(
            { url: product.url },
            product,
            { new: true }
          );

          if (!updatedProduct) {
            results.failed++;
            results.errors.push(`Failed to update DB for: ${currentProduct.url}`);
            return currentProduct;
          }

          // Check email notifications
          const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);
          
          if (emailNotifType && updatedProduct.users.length > 0) {
            try {
              const productInfo = {
                title: updatedProduct.title,
                image: updatedProduct.image,
                url: updatedProduct.url,
              };

              const emailContent = await generateEmailBody(productInfo, emailNotifType);
              const userEmails = updatedProduct.users.map((user: any) => user.email);
              
              await sendEmail(emailContent, userEmails);
            } catch (emailError) {
              console.error(`Email notification failed for ${updatedProduct.url}:`, emailError);
              // Don't fail the entire operation for email errors
            }
          }

          results.successful++;
          return updatedProduct;
          
        } catch (error) {
          results.failed++;
          results.errors.push(`Error processing ${currentProduct.url}: ${error instanceof Error ? error.message : String(error)}`);
          console.error(`Error processing product ${currentProduct.url}:`, error);
          return currentProduct; // Return original product on error
        }
      })
    );

    // Filter out any null/undefined results
    const validUpdatedProducts = updatedProducts.filter(product => product !== null && product !== undefined);

    return NextResponse.json({
      message: "Cron job completed",
      data: validUpdatedProducts,
      stats: {
        total: products.length,
        successful: results.successful,
        failed: results.failed,
        errors: results.errors
      }
    });
    
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        message: "Cron job failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}