// api/src/docs/routes/swaggerSchemas.js

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         lastname:
 *           type: string
 *         mail:
 *           type: string
 *         rut:
 *           type: string
 *         phone:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         name: "Juan"
 *         lastname: "Pérez"
 *         mail: "juan@example.com"
 *         rut: "12.345.678-9"
 *         phone: "12345678"
 *         created_at: "2023-09-21T12:34:56Z"
 *         updated_at: "2023-09-21T12:34:56Z"
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         product:
 *           type: string
 *         ingredients:
 *           type: string
 *         price:
 *           type: number
 *         weight:
 *           type: number
 *         description:
 *           type: string
 *         nutrition:
 *           type: string
 *         available:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         product: "Pan Artesanal"
 *         ingredients: "Harina, agua, sal, levadura"
 *         price: 2.50
 *         weight: 0.5
 *         description: "Pan fresco hecho con ingredientes naturales"
 *         nutrition: "Alto en fibra y vitaminas"
 *         available: true
 *         created_at: "2023-09-21T12:34:56Z"
 *         updated_at: "2023-09-21T12:34:56Z"
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_user:
 *           type: integer
 *         id_address:
 *           type: integer
 *         order_delivery_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         order_address:
 *           type: string
 *         order_city:
 *           type: string
 *         order_region:
 *           type: string
 *         order_postal_code:
 *           type: string
 *         order_phone:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         id_user: 1
 *         id_address: 2
 *         order_delivery_date: "2023-09-22"
 *         status: "En preparación"
 *         order_address: "Calle Falsa 123"
 *         order_city: "Ciudad"
 *         order_region: "Región"
 *         order_postal_code: "12345"
 *         order_phone: "987654321"
 *         created_at: "2023-09-21T12:34:56Z"
 *         updated_at: "2023-09-21T12:34:56Z"
 *
 *     Payment:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *         status:
 *           type: string
 *         details:
 *           type: object
 *       example:
 *         paymentId: "PAY123456"
 *         status: "created"
 *         details: {}
 */
