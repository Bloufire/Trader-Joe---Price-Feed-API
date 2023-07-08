import express from 'express';
import { getSinglePairPrice as getSinglePairPriceV1, getBatchPrices as getBatchPricesV1 } from '../controllers/priceControllerV1';
import { getSinglePairPrice as getSinglePairPriceV2, getBatchPrices as getBatchPricesV2 } from '../controllers/priceControllerV2';
import { getSinglePairPrice as getSinglePairPriceV2_1, getBatchPrices as getBatchPricesV2_1 } from '../controllers/priceControllerV2_1';

const router = express.Router();

/** Swagger Doc for GET/v1
*    @swagger
*    /v1/prices/{base}/{quote}:
*    get:
*      tags:
*        - v1
*      summary: Get the price of a single pair
*      parameters:
*        - in: path
*          name: base
*          schema:
*            type: string
*          required: true
*          description: Base asset address
*        - in: path
*          name: quote
*          schema:
*            type: string
*          required: true
*          description: Quote asset address
*      responses:
*        '200':
*          description: OK
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  price:
*                    type: number
*/
router.get('/v1/prices/:base_asset/:quote_asset', getSinglePairPriceV1);

/** Swagger Doc for POST/v1
*    @swagger
*    /v1/batch-prices:
*    post:
*      tags:
*        - v1
*      summary: Get prices for multiple pairs
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                pairs:
*                  type: array
*                  items:
*                    type: object
*                    properties:
*                      base_asset:
*                        type: string
*                      quote_asset:
*                        type: string
*      responses:
*        '200':
*          description: OK
*          content:
*            application/json:
*              schema:
*                type: object
*                additionalProperties:
*                  type: number
*/
router.post('/v1/batch-prices/', getBatchPricesV1);

/** Swagger Doc for GET/v2
*    @swagger
*    /v2/prices/{base}/{quote}/{bin_step}:
*    get:
*      tags:
*        - v2
*      summary: Get the price of a single pair
*      description: base/quote and quote/base will get the same results because we use contract data for calculations, tokenX = base, tokenY = quote
*      parameters:
*        - in: path
*          name: base
*          schema:
*            type: string
*          required: true
*          description: Base asset address
*        - in: path
*          name: quote
*          schema:
*            type: string
*          required: true
*          description: Quote asset address
*        - in: path
*          name: bin_step
*          schema:
*            type: string
*          required: true
*          description: Bin step for base / quote pair
*      responses:
*        '200':
*          description: OK
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  price:
*                    type: number
*/
router.get('/v2/prices/:base_asset/:quote_asset/:bin_step', getSinglePairPriceV2);

/** Swagger Doc for POST/v2
*    @swagger
*    /v2/batch-prices:
*    post:
*      tags:
*        - v2
*      summary: Get prices for multiple pairs
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                pairs:
*                  type: array
*                  items:
*                    type: object
*                    properties:
*                      base_asset:
*                        type: string
*                      quote_asset:
*                        type: string
*                      bin_step:
*                        type: string
*      responses:
*        '200':
*          description: OK
*          content:
*            application/json:
*              schema:
*                type: object
*                additionalProperties:
*                  type: number
*/
router.post('/v2/batch-prices/', getBatchPricesV2);

/** Swagger Doc for GET/v2.1
*    @swagger
*    /v2_1/prices/{base}/{quote}/{bin_step}:
*    get:
*      tags:
*        - v2.1
*      summary: Get the price of a single pair
*      description: base/quote and quote/base will get the same results because we use contract data for calculations, tokenX = base, tokenY = quote
*      parameters:
*        - in: path
*          name: base
*          schema:
*            type: string
*          required: true
*          description: Base asset address
*        - in: path
*          name: quote
*          schema:
*            type: string
*          required: true
*          description: Quote asset address
*        - in: path
*          name: bin_step
*          schema:
*            type: string
*          required: true
*          description: Bin step for base / quote pair
*      responses:
*        '200':
*          description: OK
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  price:
*                    type: number
*/
router.get('/v2_1/prices/:base_asset/:quote_asset/:bin_step', getSinglePairPriceV2_1);

/** Swagger Doc for POST/v2.1
*    @swagger
*    /v2_1/batch-prices:
*    post:
*      tags:
*        - v2.1
*      summary: Get prices for multiple pairs
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                pairs:
*                  type: array
*                  items:
*                    type: object
*                    properties:
*                      base_asset:
*                        type: string
*                      quote_asset:
*                        type: string
*                      bin_step:
*                        type: string
*      responses:
*        '200':
*          description: OK
*          content:
*            application/json:
*              schema:
*                type: object
*                additionalProperties:
*                  type: number
*/
router.post('/v2_1/batch-prices/', getBatchPricesV2_1);


export default router;