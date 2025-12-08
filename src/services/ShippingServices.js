import requests from "./httpServices";

/**
 * Shipping Services for Stallion Express Integration
 * Client-side API calls to server shipping endpoints
 */

const ShippingServices = {
  /**
   * Get available postage types
   * @returns {Promise} List of postage types
   */
  getPostageTypes: async () => {
    return requests.get("/shipping/postage-types");
  },

  /**
   * Get shipping rates for checkout
   * @param {Object} body - Rate request payload
   * @param {Object} body.destination - Destination address
   * @param {Array} body.parcels - Array of parcels with weight/dimensions
   * @param {string} body.serviceType - Optional service type filter
   * @returns {Promise} Available shipping rates
   */
  getRates: async (body) => {
    return requests.post("/shipping/rates", body);
  },

  /**
   * Create a shipment after order is placed
   * @param {Object} body - Shipment creation payload
   * @param {string} body.orderId - Order ID to attach shipment to
   * @param {string} body.service - Selected shipping service
   * @param {Object} body.destination - Destination address
   * @param {Array} body.parcels - Array of parcels
   * @returns {Promise} Created shipment details
   */
  createShipment: async (body) => {
    return requests.post("/shipping/create", body);
  },

  /**
   * Track a shipment by tracking ID
   * @param {string} trackingId - Tracking number
   * @returns {Promise} Tracking information
   */
  trackShipment: async (trackingId) => {
    return requests.get(`/shipping/track/${trackingId}`);
  },

  /**
   * Cancel a shipment for an order
   * @param {string} orderId - Order ID
   * @returns {Promise} Cancellation result
   */
  cancelShipment: async (orderId) => {
    return requests.delete(`/shipping/cancel/${orderId}`);
  },
};

export default ShippingServices;
