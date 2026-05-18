export default async function handler(req, res) {
  // 1. Validasi Method (Hanya izinkan POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed' 
    });
  }

  try {
    // 2. Ambil API Key dari Environment Vercel
    const apiKey = process.env.BAYAR_GG_API_KEY;

    if (!apiKey) {
      console.error('CRITICAL: BAYAR_GG_API_KEY tidak ditemukan di Vercel Environment!');
      return res.status(500).json({ 
        success: false, 
        error: 'Konfigurasi Server Error. Hubungi Admin.' 
      });
    }

    // 3. Forward request ke API Bayar.GG (API Key Anda aman di server ini)
    const response = await fetch('https://www.bayar.gg/api/create-payment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      // Lempar payload dari frontend React Anda
      body: JSON.stringify({
        amount: req.body.amount,
        description: req.body.description,
        customer_name: req.body.customer_name,
        customer_email: req.body.customer_email,
        customer_phone: req.body.customer_phone,
        payment_method: req.body.payment_method
      })
    });

    // 4. Parse respons dari Bayar.GG
    const data = await response.json();
    
    // 5. Tangani penolakan dari gateway
    if (!response.ok || !data.success) {
      console.error('Bayar.GG API Error:', data);
      return res.status(400).json({ 
        success: false, 
        error: data.message || data.error || 'Gagal membuat pembayaran di Gateway' 
      });
    }

    // 6. Sukses! Kembalikan data QRIS/Invoice ke Frontend
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Internal Server Error (Create Payment):', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Terjadi kesalahan internal pada server kami.' 
    });
  }
}

