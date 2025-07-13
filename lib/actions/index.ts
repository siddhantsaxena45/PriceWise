"use server"
import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utlis";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer/indes";


export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) return;
    try {
        connectToDB();
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
        if (!scrapedProduct) return;
        let product = scrapedProduct;
        const existingProduct = await Product.findOne({ url: scrapedProduct.url });
        if (existingProduct) {
            const updatedPrice: any = [
                ...existingProduct.priceHistory,
                {
                    price: scrapedProduct.currentPrice,

                }
            ]
            product = {
                ...scrapedProduct,
                priceHistory: updatedPrice,
                lowestPrice: getLowestPrice(updatedPrice),
                highestPrice: getHighestPrice(updatedPrice),
                averagePrice: getAveragePrice(updatedPrice)
            }

        }
        

        const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, { upsert: true, new: true });
        revalidatePath(`/products/${newProduct._id}`);
      
    }
    catch (error: any) {
        throw new Error('Failed to create/update product')
    }
}

export async function getProductById(productId: string) {
  try {
    await connectToDB();
    const product = await Product.findById(productId); // ✅ fix here
    if (!product) return null;
    return product;
  } catch (error: any) {
    console.error("Error in getProductById:", error);
    return null;
  }
}

export async function getAllProducts() {
    try {
        connectToDB();
        const products = await Product.find();
        if(!products) return null
        return products;
    }
    catch (error: any) {
        console.log(error)
    }
    
}
export async function getSimilarProducts(id: string, category: string) {
  try {
    await connectToDB();

    const products = await Product.find({
      _id: { $ne: id }, // exclude current product
      category: category,                  
    }).limit(3); 

    return products;
  } catch (error) {
    console.log("Error fetching similar products:", error);
    return null;
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if(!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}