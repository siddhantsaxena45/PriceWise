
# 🛍️ PriceWise – Amazon Price Tracker

**PriceWise** is a full-stack price tracker app that scrapes Amazon product data and notifies users when prices drop. Built using **Next.js**, **MongoDB**, **Cheerio**, **Bright Data**, and **Nodemailer**, this tool helps users track products, view historical price trends, and receive email alerts—all automatically through scheduled cron jobs.

---

## 🚀 Features

- 🔍 **Amazon Scraper**: Extracts product info like title, image, price (current/original), discount %, availability, rating, and review count using Cheerio.
- 💰 **Price Analytics**: Tracks average, highest, and lowest prices over time.
- 📬 **Email Notifications**: Sends automatic alerts when a product’s price drops.
- ⏰ **Cron Jobs**: Uses [cronjob.org](https://cronjob.org) to run scheduled scraping and email logic.
- ☁️ **MongoDB Integration**: Stores product data and historical price logs efficiently.
- 📦 **Bright Data Proxy**: Scrapes Amazon reliably using residential proxy rotation.

---

## 🧠 Project Structure

```bash
/lib
  ├── scraper.js             # Cheerio scraping logic
  ├── mongoose.js            # DB connection
  ├── utils.js               # Price utilities (avg, min, max)
  └── nodemailer/index.js    # Email setup and sender

/models
  └── product.model.js       # MongoDB schema for products

/app/api
  └── scrape/route.js        # API endpoint to trigger scraping

/public
  └── images/                # Fallback assets or UI icons
````

---

## 🛠️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/siddhantsaxena45/pricewise.git
   cd pricewise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env.local` file:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   BRIGHTDATA_PROXY=http://username:password@proxy.brightdata.io:port
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_app_password
   ```

4. **Run locally**

   ```bash
   npm run dev
   ```

---

## 🔁 Setting Up Cron Job

Use [cronjob.org](https://cronjob.org) or any scheduler to trigger scraping:

**Endpoint to call (POST):**

```
https://yourdomain.com/api/cron
```

Recommended interval: every 12 or 24 hours.

---

## 📧 Email Notification Example

When a price drops below the user's target or the lowest historical average, an email is sent like:

> **Subject**: Price Drop Alert!
> **Body**: Your watched item "Samsung SSD" dropped to ₹3,999! Click to check it out.

Emails are sent using `Nodemailer` through your Gmail or SMTP provider.

---

## 📊 Sample Scraped Data

```json
{
  "title": "Noise ColorFit Pulse 2 Max Smart Watch",
  "currentPrice": 1499,
  "originalPrice": 3999,
  "discountRate": 63,
  "image": "https://m.media-amazon.com/...",
  "rating": 4.2,
  "reviewsCount": 4200,
  "availability": "In Stock"
}
```

---

## ✨ Technologies Used

* **Next.js 14 (App Router)**
* **MongoDB + Mongoose**
* **Cheerio (Web Scraper)**
* **Bright Data Proxy**
* **Nodemailer**
* **Cronjob.org**
* **Tailwind CSS (optional for frontend)**

---

## 📌 Future Improvements

* ✅ Add user authentication and product dashboards
* 📈 Integrate chart view for price history
* 📱 Build mobile-friendly UI
* 🛡️ Add CAPTCHA bypass for scraper
* 🧠 AI-based prediction of future price drops

---


