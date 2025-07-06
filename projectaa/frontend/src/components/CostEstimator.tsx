import React, { useState } from "react";
import axios from "axios";

const plans = ["PlanA", "PlanB"];
const cptCodes = [
  { code: "99213", description: "Office visit" },
  { code: "80050", description: "General health panel" },
  { code: "93000", description: "EKG" },
];

const CostEstimator: React.FC = () => {
  const [plan, setPlan] = useState(plans[0]);
  const [cptCode, setCptCode] = useState(cptCodes[0].code);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/entries/estimate_cost", {
        plan,
        cpt_code: cptCode,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cost Estimator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Insurance Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full border rounded p-2"
          >
            {plans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Procedure (CPT Code)</label>
          <select
            value={cptCode}
            onChange={(e) => setCptCode(e.target.value)}
            className="w-full border rounded p-2"
          >
            {cptCodes.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.description}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Estimate Cost
        </button>
      </form>
      {result && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <div>
            <strong>Estimated Out-of-Pocket:</strong> ${result.estimated_out_of_pocket.toFixed(2)}
          </div>
          <div>
            <strong>Procedure Cost:</strong> ${result.procedure_cost}
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 rounded text-red-700">{error}</div>
      )}
    </div>
  );
};

export default CostEstimator;