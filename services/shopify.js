import axios from "axios";


export async function getOrderDetails(orderId, req) {
const token = req.session.accessToken;
const domain = process.env.SHOPIFY_DOMAIN;


const response = await axios.get(
`https://${domain}/admin/api/2024-01/orders/${orderId}.json`,
{
headers: { "X-Shopify-Access-Token": token },
}
);


return response.data.order;
}
