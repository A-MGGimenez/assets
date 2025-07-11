//este codigo se encarga de obtener el precio de bitcoin en tiempo real estableciendo una copnexcion tipo via websocket del lado del cliente

let lastPrice = null;

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

function applyPriceEffect(currentPrice, priceElement) {
  if (!priceElement) return;

  if (lastPrice !== null) {
    if (currentPrice > lastPrice) {
      priceElement.classList.add('price-up');
      priceElement.classList.remove('price-down');
    } else if (currentPrice < lastPrice) {
      priceElement.classList.add('price-down');
      priceElement.classList.remove('price-up');
    }
  }

  // Pulso suave
  priceElement.classList.remove('pulse');
  void priceElement.offsetWidth;
  priceElement.classList.add('pulse');

  lastPrice = currentPrice;
}

function startLivePriceStream() {
  const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);

      const priceElement = document.getElementById('btc-price');
      if (priceElement) {
        priceElement.textContent = formatPrice(price);
        applyPriceEffect(price, priceElement.parentElement);
      }
    } catch (e) {
      console.error('Error procesando mensaje WebSocket:', e);
    }
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  socket.onclose = () => {
    console.warn('WebSocket cerrado. Reconectando en 5s...');
    setTimeout(startLivePriceStream, 5000);
  };
}

//comenta lo mas que puedas que funcion desempeña cualquier actuyalizacion que le hagas, podes actualizar sin drama, no esta conectado con la pagina directamente
