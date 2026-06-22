export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400', advice: 'Consider a balanced nutrition plan with strength training.' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-400', advice: 'Great job! Maintain your current fitness routine.' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400', advice: 'Our weight loss programs can help you reach your goals.' };
  return { label: 'Obese', color: 'text-titan-red', advice: 'Consult our trainers for a personalized fitness plan.' };
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
