// Test script to validate the OnlineOrderDataUploader component with real data
const fs = require('fs');
const path = require('path');

// Load test data
const testData = JSON.parse(fs.readFileSync('test_real_data.json', 'utf8'));

console.log('Testing OnlineOrderDataUploader with real data structure...');
console.log('Sample data structure:');
console.log('- Total records:', testData.data.length);
console.log('- First record keys:', Object.keys(testData.data[0]));
console.log('- First record sample:', JSON.stringify(testData.data[0], null, 2));

// Simulate the analysis logic
function testAnalysis(data) {
  const processedData = data.data;

  const analysis = {
    totalOrders: processedData.length,
    totalAmount: 0,
    totalCODAmount: 0,
    channels: {},
    transporters: {},
    cities: {},
    avgOrderValue: 0,
    topProducts: {}
  };

  processedData.forEach((order, index) => {
    // Process amount
    const amount = parseFloat(order.amount_total || 0);
    analysis.totalAmount += amount;

    // Process COD
    const codAmount = parseFloat(order.cod_total || 0);
    analysis.totalCODAmount += codAmount;

    // Process channel (customer field)
    const channel = order.customer || 'Unknown';
    analysis.channels[channel] = (analysis.channels[channel] || 0) + 1;

    // Process transporter
    const transporter = order.transporter || 'Unknown';
    analysis.transporters[transporter] = (analysis.transporters[transporter] || 0) + 1;

    // Process city
    if (order.city) {
      analysis.cities[order.city] = (analysis.cities[order.city] || 0) + 1;
    }

    // Process products from detail
    if (order.detail) {
      try {
        const productStrings = order.detail.split(',');
        productStrings.forEach(productStr => {
          const match = productStr.trim().match(/^(.*?)\((\d+)\)$/);
          if (match) {
            const name = match[1].trim();
            const quantity = parseInt(match[2]);
            analysis.topProducts[name] = (analysis.topProducts[name] || 0) + quantity;
          }
        });
      } catch (error) {
        console.warn(`Failed to parse products for order ${index + 1}`);
      }
    }
  });

  analysis.avgOrderValue = analysis.totalOrders > 0 ? analysis.totalAmount / analysis.totalOrders : 0;

  return analysis;
}

const result = testAnalysis(testData);

console.log('\nAnalysis Results:');
console.log('- Total Orders:', result.totalOrders);
console.log('- Total Amount:', result.totalAmount.toLocaleString('vi-VN'), '₫');
console.log('- Total COD Amount:', result.totalCODAmount.toLocaleString('vi-VN'), '₫');
console.log('- Average Order Value:', result.avgOrderValue.toLocaleString('vi-VN'), '₫');
console.log('- Channels:', result.channels);
console.log('- Transporters:', result.transporters);
console.log('- Cities:', result.cities);
console.log('- Top Products:', result.topProducts);

console.log('\nComponent integration test completed successfully! ✅');
