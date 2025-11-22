import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getOrderDetails } from "../services/shopify.js";


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Generate Printable GST Invoice
router.get("/:orderId", async (req, res) => {
try {
const orderId = req.params.orderId;
const order = await getOrderDetails(orderId, req);


const templatePath = path.join(__dirname, "../templates/invoice.html");
let template = fs.readFileSync(templatePath, "utf-8");


// Replace variables
template = template
.replace("{{order_id}}", order.id)
.replace("{{date}}", order.created_at.split("T")[0])
.replace("{{customer_name}}", order.customer.first_name + " " + order.customer.last_name)
.replace("{{customer_address}}", order.shipping_address.address1)
.replace("{{customer_city}}", order.shipping_address.city)
.replace("{{customer_state}}", order.shipping_address.province)
.replace("{{customer_pin}}", order.shipping_address.zip)
.replace("{{customer_phone}}", order.shipping_address.phone)
.replace("{{amount}}", order.total_price)
.replace("{{gst}}", (order.total_price * 0.18).toFixed(2));


res.send(template);
} catch (err) {
console.error(err);
res.status(500).send("Failed to create invoice");
}
});


export default router;
