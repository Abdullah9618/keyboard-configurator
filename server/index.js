import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Mock product database
const products = {
  keyboard: {
    id: 'auragear-pro',
    name: 'AuraGear Pro Mechanical Keyboard',
    basePrice: 179.99,
    switches: {
      red: {
        name: 'Cherry MX Red',
        type: 'Linear',
        priceModifier: 10.00,
        stock: 42,
        description: 'Smooth linear switches, ideal for gaming'
      },
      blue: {
        name: 'Cherry MX Blue',
        type: 'Clicky',
        priceModifier: 20.00,
        stock: 28,
        description: 'Satisfying clicky feedback for typing enthusiasts'
      },
      brown: {
        name: 'Cherry MX Brown',
        type: 'Tactile',
        priceModifier: 15.00,
        stock: 35,
        description: 'Tactile bump with quiet operation'
      }
    }
  }
}

// Simulate network latency
const simulateLatency = (min = 200, max = 500) => {
  const delay = Math.random() * (max - min) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * GET /api/product
 * Fetch product price and stock based on configuration
 * Query params:
 *   - switch: 'red' | 'blue' | 'brown'
 */
app.get('/api/product', async (req, res) => {
  try {
    await simulateLatency()

    const { switch: switchType = 'red' } = req.query
    const product = products.keyboard
    const switchConfig = product.switches[switchType]

    if (!switchConfig) {
      return res.status(400).json({
        error: 'Invalid switch type',
        validTypes: Object.keys(product.switches)
      })
    }

    // Calculate final price
    const price = product.basePrice + switchConfig.priceModifier

    // Simulate stock fluctuation (realistic inventory behavior)
    const stockVariation = Math.floor(Math.random() * 5) - 2
    const currentStock = Math.max(0, switchConfig.stock + stockVariation)

    res.json({
      productId: product.id,
      name: product.name,
      switchType: switchType,
      switchName: switchConfig.name,
      switchDescription: switchConfig.description,
      price: price,
      stock: currentStock,
      inStock: currentStock > 0,
      lowStock: currentStock > 0 && currentStock <= 10,
      currency: 'USD',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/product/specs
 * Fetch full product specifications
 */
app.get('/api/product/specs', async (req, res) => {
  try {
    await simulateLatency(100, 300)

    res.json({
      productId: 'auragear-pro',
      name: 'AuraGear Pro Mechanical Keyboard',
      specs: {
        layout: '75% Compact',
        keys: 84,
        connectivity: ['USB-C', 'Bluetooth 5.0', '2.4GHz Wireless'],
        battery: {
          capacity: '4000mAh',
          life: '200 hours (LED off)'
        },
        backlight: {
          type: 'RGB Per-Key',
          colors: '16.8 million',
          effects: 20
        },
        material: {
          frame: 'CNC Aluminum',
          keycaps: 'Double-shot PBT'
        },
        dimensions: {
          width: 325,
          depth: 145,
          height: 35,
          unit: 'mm'
        },
        weight: {
          value: 820,
          unit: 'g'
        },
        pollingRate: '1000Hz',
        nkro: true,
        hotSwappable: true,
        soundDampening: true,
        onboardMemory: '5 profiles'
      },
      warranty: '2 years',
      inBox: [
        'AuraGear Pro Keyboard',
        'USB-C Cable (Braided, 2m)',
        '2.4GHz Wireless Dongle',
        'Keycap Puller',
        'Extra Keycaps Set',
        'User Manual'
      ]
    })
  } catch (error) {
    console.error('Error fetching specs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/cart/add
 * Add item to cart
 */
app.post('/api/cart/add', async (req, res) => {
  try {
    await simulateLatency(100, 200)

    const { productId, switchType, quantity = 1 } = req.body

    if (!productId || !switchType) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Mock successful add to cart
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        itemId: `cart-${Date.now()}`,
        productId,
        switchType,
        quantity,
        addedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AuraGear API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║       🎹 AuraGear API Server              ║
║       Running on port ${PORT}                ║
╚═══════════════════════════════════════════╝
  
  Endpoints:
  • GET  /api/product?switch=red|blue|brown
  • GET  /api/product/specs
  • POST /api/cart/add
  • GET  /api/health
  `)
})
