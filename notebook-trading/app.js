const stocks = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", price: 2500 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3700 },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1500 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1600 },
  { symbol: "ITC", name: "ITC Ltd.", price: 450 }
];

let selectedStock = stocks[0];
let balance = 100000;
let portfolio = {};
let orders = [];
let trades = [];

// Populate Market Watch
function renderMarketWatch() {
  const list = document.getElementById("market-watch-list");
  list.innerHTML = "";
  stocks.forEach(stock => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="symbol">${stock.symbol}</span>
      <span class="price">₹${stock.price.toFixed(2)}</span>
    `;
    li.onclick = () => selectStock(stock.symbol);
    if (stock.symbol === selectedStock.symbol) li.classList.add("active");
    list.appendChild(li);
  });
}

// Select Stock
function selectStock(symbol) {
  selectedStock = stocks.find(s => s.symbol === symbol);
  updateStockDetails();
  renderMarketWatch();
  updateChart();
}

// Update Stock Details
function updateStockDetails() {
  document.getElementById("stock-symbol").textContent = selectedStock.symbol;
  document.getElementById("stock-name").textContent = selectedStock.name;
  document.getElementById("stock-price-value").textContent = `₹${selectedStock.price.toFixed(2)}`;
  document.getElementById("stock-price-change").textContent = "+0.0%";
  document.getElementById("stock-price-change").className = "change";
}

// Render Portfolio
function renderPortfolio() {
  const list = document.getElementById("portfolio-list");
  list.innerHTML = "";
  Object.keys(portfolio).forEach(symbol => {
    const entry = portfolio[symbol];
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="symbol">${symbol}</span>
      <span class="qty">${entry.qty}</span>
      <span class="avg-price">₹${entry.avgPrice.toFixed(2)}</span>
      <span class="value">₹${(entry.qty * entry.avgPrice).toFixed(2)}</span>
    `;
    list.appendChild(li);
  });
}

// Handle Order Form
document.getElementById("order-form").onsubmit = function(e) {
  e.preventDefault();
  const type = document.getElementById("order-type").value;
  const qty = parseInt(document.getElementById("order-qty").value, 10);
  if (qty < 1) return;
  const price = selectedStock.price;
  let message = "";

  if (type === "buy") {
    const cost = price * qty;
    if (cost > balance) {
      message = "Insufficient balance!";
    } else {
      balance -= cost;
      if (!portfolio[selectedStock.symbol]) {
        portfolio[selectedStock.symbol] = { qty: 0, avgPrice: 0 };
      }
      const entry = portfolio[selectedStock.symbol];
      entry.avgPrice = ((entry.qty * entry.avgPrice) + (qty * price)) / (entry.qty + qty);
      entry.qty += qty;
      orders.push({ type, symbol: selectedStock.symbol, qty, price, status: "completed" });
      trades.push({ type, symbol: selectedStock.symbol, qty, price });
      message = "Buy order executed!";
    }
  } else if (type === "sell") {
    if (!portfolio[selectedStock.symbol] || portfolio[selectedStock.symbol].qty < qty) {
      message = "Not enough shares!";
    } else {
      balance += price * qty;
      portfolio[selectedStock.symbol].qty -= qty;
      if (portfolio[selectedStock.symbol].qty === 0) delete portfolio[selectedStock.symbol];
      orders.push({ type, symbol: selectedStock.symbol, qty, price, status: "completed" });
      trades.push({ type, symbol: selectedStock.symbol, qty, price });
      message = "Sell order executed!";
    }
  }
  document.getElementById("balance").textContent = `₹${balance.toLocaleString()}`;
  document.getElementById("order-message").textContent = message;
  renderPortfolio();
  renderOrders();
  renderTrades();
};

// Render Orders
function renderOrders() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";
  orders.slice(-5).reverse().forEach(order => {
    const li = document.createElement("li");
    li.className = order.type;
    li.innerHTML = `
      <span class="type">${order.type.toUpperCase()}</span>
      <span class="symbol">${order.symbol}</span>
      <span class="qty">${order.qty}</span>
      <span class="price">₹${order.price.toFixed(2)}</span>
      <span class="status completed">Completed</span>
    `;
    list.appendChild(li);
  });
}

// Render Trades
function renderTrades() {
  const list = document.getElementById("trade-list");
  list.innerHTML = "";
  trades.slice(-5).reverse().forEach(trade => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="type">${trade.type.toUpperCase()}</span>
      <span class="symbol">${trade.symbol}</span>
      <span class="qty">${trade.qty}</span>
      <span class="price">₹${trade.price.toFixed(2)}</span>
    `;
    list.appendChild(li);
  });
}

// Chart.js Example
function updateChart() {
  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) chart.destroy();

  // Generate random OHLC data for demonstration
  const ohlc = [];
  let lastClose = selectedStock.price;
  for (let i = 0; i < 30; i++) {
    const open = lastClose + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 10;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    ohlc.push({ x: i, o: open, h: high, l: low, c: close });
    lastClose = close;
  }

  chart = new Chart(ctx, {
    type: 'candlestick',
    data: {
      datasets: [{
        label: selectedStock.symbol,
        data: ohlc,
        borderColor: '#4e99e8',
        color: {
          up: '#4ade80',
          down: '#ef4444',
          unchanged: '#ccc'
        }
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// Initial Render
renderMarketWatch();
updateStockDetails();
renderPortfolio();
renderOrders();
renderTrades();
updateChart();

// Populate Market Watch
function renderMarketWatch() {
  const list = document.getElementById("market-watch-list");
  list.innerHTML = "";
  stocks.forEach(stock => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="symbol">${stock.symbol}</span>
      <span class="price">₹${stock.price.toFixed(2)}</span>
    `;
    li.onclick = () => selectStock(stock.symbol);
    if (stock.symbol === selectedStock.symbol) li.classList.add("active");
    list.appendChild(li);
  });
}

// Select Stock
function selectStock(symbol) {
  selectedStock = stocks.find(s => s.symbol === symbol);
  updateStockDetails();
  renderMarketWatch();
  updateChart();
}

// Update Stock Details
function updateStockDetails() {
  document.getElementById("stock-symbol").textContent = selectedStock.symbol;
  document.getElementById("stock-name").textContent = selectedStock.name;
  document.getElementById("stock-price-value").textContent = `₹${selectedStock.price.toFixed(2)}`;
  document.getElementById("stock-price-change").textContent = "+0.0%";
  document.getElementById("stock-price-change").className = "change";
}

// Render Portfolio
function renderPortfolio() {
  const list = document.getElementById("portfolio-list");
  list.innerHTML = "";
  Object.keys(portfolio).forEach(symbol => {
    const entry = portfolio[symbol];
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="symbol">${symbol}</span>
      <span class="qty">${entry.qty}</span>
      <span class="avg-price">₹${entry.avgPrice.toFixed(2)}</span>
      <span class="value">₹${(entry.qty * entry.avgPrice).toFixed(2)}</span>
    `;
    list.appendChild(li);
  });
}

// Handle Order Form
document.getElementById("order-form").onsubmit = function(e) {
  e.preventDefault();
  const type = document.getElementById("order-type").value;
  const qty = parseInt(document.getElementById("order-qty").value, 10);
  if (qty < 1) return;
  const price = selectedStock.price;
  let message = "";

  if (type === "buy") {
    const cost = price * qty;
    if (cost > balance) {
      message = "Insufficient balance!";
    } else {
      balance -= cost;
      if (!portfolio[selectedStock.symbol]) {
        portfolio[selectedStock.symbol] = { qty: 0, avgPrice: 0 };
      }
      const entry = portfolio[selectedStock.symbol];
      entry.avgPrice = ((entry.qty * entry.avgPrice) + (qty * price)) / (entry.qty + qty);
      entry.qty += qty;
      orders.push({ type, symbol: selectedStock.symbol, qty, price, status: "completed" });
      trades.push({ type, symbol: selectedStock.symbol, qty, price });
      message = "Buy order executed!";
    }
  } else if (type === "sell") {
    if (!portfolio[selectedStock.symbol] || portfolio[selectedStock.symbol].qty < qty) {
      message = "Not enough shares!";
    } else {
      balance += price * qty;
      portfolio[selectedStock.symbol].qty -= qty;
      if (portfolio[selectedStock.symbol].qty === 0) delete portfolio[selectedStock.symbol];
      orders.push({ type, symbol: selectedStock.symbol, qty, price, status: "completed" });
      trades.push({ type, symbol: selectedStock.symbol, qty, price });
      message = "Sell order executed!";
    }
  }
  document.getElementById("balance").textContent = `₹${balance.toLocaleString()}`;
  document.getElementById("order-message").textContent = message;
  renderPortfolio();
  renderOrders();
  renderTrades();
};

// Render Orders
function renderOrders() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";
  orders.slice(-5).reverse().forEach(order => {
    const li = document.createElement("li");
    li.className = order.type;
    li.innerHTML = `
      <span class="type">${order.type.toUpperCase()}</span>
      <span class="symbol">${order.symbol}</span>
      <span class="qty">${order.qty}</span>
      <span class="price">₹${order.price.toFixed(2)}</span>
      <span class="status completed">Completed</span>
    `;
    list.appendChild(li);
  });
}

// Render Trades
function renderTrades() {
  const list = document.getElementById("trade-list");
  list.innerHTML = "";
  trades.slice(-5).reverse().forEach(trade => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="type">${trade.type.toUpperCase()}</span>
      <span class="symbol">${trade.symbol}</span>
      <span class="qty">${trade.qty}</span>
      <span class="price">₹${trade.price.toFixed(2)}</span>
    `;
    list.appendChild(li);
  });
}

// Chart.js Example
let chart;
function updateChart() {
  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: 20}, (_, i) => i + 1),
      datasets: [{
        label: selectedStock.symbol,
        data: Array.from({length: 20}, () => selectedStock.price + (Math.random() - 0.5) * 20),
        borderColor: '#4e99e8',
        backgroundColor: 'rgba(78,153,232,0.1)',
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// Initial Render
renderMarketWatch();
updateStockDetails();
renderPortfolio();
renderOrders();
renderTrades();
updateChart();