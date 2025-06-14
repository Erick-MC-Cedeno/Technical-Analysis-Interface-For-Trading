const API_BASE_URL = 'https://effective-bassoon-5j4gqrq4r4gc7g7j-5000.app.github.dev/api';

export const fetchTradingData = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trading/${symbol}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching trading data:', error);
    throw error;
  }
};

