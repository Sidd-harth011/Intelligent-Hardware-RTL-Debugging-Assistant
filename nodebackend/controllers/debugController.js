// nodebackend/controllers/debugController.js

exports.analyzeDesign = async (req, res) => {
  try {
    const { code, prompt } = req.body;

    // Basic validation
    if (!code || !prompt) {
      return res.status(400).json({ message: 'Code and prompt are required for analysis.' });
    }

    console.log("--- INCOMING DEBUG SESSION ---");
    console.log("Prompt:", prompt);
    console.log("Forwarding payload to Python ML Microservice...");

    // The Bridge: Send data from Node (Port 5000) to Python (Port 8000)
    const pythonResponse = await fetch('http://localhost:8000/api/ml/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, prompt })
    });

    if (!pythonResponse.ok) {
      throw new Error(`Python service failed with status: ${pythonResponse.status}`);
    }

    // Parse the response from Python
    const mlData = await pythonResponse.json();
    console.log("Received response from Python Engine!");

    // Relay the Python data back to the React frontend
    res.status(200).json(mlData);

  } catch (error) {
    console.error("ANALYSIS CRASH:", error);
    res.status(500).json({ 
      message: 'Server error during analysis. Is your Python FastAPI server running?' 
    });
  }
};