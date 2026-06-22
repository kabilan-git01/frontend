import { useState } from 'react';
import { PageHeader } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { calculateBMI, getBMICategory } from '../utils/helpers';

export default function BMICalculator() {
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const validate = () => {
    const newErrors = {};
    const w = parseFloat(weight);

    if (!weight || isNaN(w) || w <= 0) {
      newErrors.weight = 'Enter a valid weight';
    } else if (unit === 'metric' && (w < 20 || w > 300)) {
      newErrors.weight = 'Weight must be between 20-300 kg';
    } else if (unit === 'imperial' && (w < 44 || w > 660)) {
      newErrors.weight = 'Weight must be between 44-660 lbs';
    }

    if (unit === 'metric') {
      const h = parseFloat(height);
      if (!height || isNaN(h) || h <= 0) {
        newErrors.height = 'Enter a valid height';
      } else if (h < 100 || h > 250) {
        newErrors.height = 'Height must be between 100-250 cm';
      }
    } else {
      const ft = parseFloat(heightFt);
      const inches = parseFloat(heightIn) || 0;
      if (!heightFt || isNaN(ft) || ft <= 0) {
        newErrors.height = 'Enter a valid height';
      } else if (ft < 3 || ft > 8) {
        newErrors.height = 'Height must be between 3-8 ft';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let weightKg, heightCm;

    if (unit === 'metric') {
      weightKg = parseFloat(weight);
      heightCm = parseFloat(height);
    } else {
      weightKg = parseFloat(weight) * 0.453592;
      heightCm = (parseFloat(heightFt) * 12 + (parseFloat(heightIn) || 0)) * 2.54;
    }

    const bmi = calculateBMI(weightKg, heightCm);
    const category = getBMICategory(bmi);
    setResult({ bmi: bmi.toFixed(1), ...category });
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setHeightFt('');
    setHeightIn('');
    setErrors({});
    setResult(null);
  };

  return (
    <div>
      <PageHeader title="BMI Calculator" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'BMI Calculator' }]} />

      <section className="section-padding">
        <div className="container-titan max-w-2xl">
          <div className="glass-card p-6 md:p-10">
            <div className="flex justify-center gap-2 mb-8">
              {['metric', 'imperial'].map((u) => (
                <button
                  key={u}
                  onClick={() => { setUnit(u); handleReset(); }}
                  className={`px-6 py-2 text-sm uppercase tracking-wider rounded-lg border transition-all ${
                    unit === u ? 'bg-titan-red border-titan-red text-white' : 'border-white/20 text-titan-secondary hover:border-titan-red/50'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-sm text-titan-secondary mb-2">
                  Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={`input-field ${errors.weight ? 'border-red-500' : ''}`}
                  placeholder={unit === 'metric' ? 'e.g. 75' : 'e.g. 165'}
                  step="0.1"
                />
                {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
              </div>

              {unit === 'metric' ? (
                <div>
                  <label className="block text-sm text-titan-secondary mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className={`input-field ${errors.height ? 'border-red-500' : ''}`}
                    placeholder="e.g. 175"
                  />
                  {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-titan-secondary mb-2">Height (ft & in)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className={`input-field ${errors.height ? 'border-red-500' : ''}`} placeholder="Feet" />
                    <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="input-field" placeholder="Inches" />
                  </div>
                  {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">Calculate BMI</Button>
                <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
              </div>
            </form>

            {result && (
              <div className="mt-8 p-6 rounded-xl bg-titan-dark border border-white/10 text-center animate-fade-in">
                <p className="text-titan-secondary text-sm uppercase tracking-wider mb-2">Your BMI</p>
                <div className="text-5xl font-heading font-bold text-gradient mb-3">{result.bmi}</div>
                <p className={`text-lg font-semibold mb-2 ${result.color}`}>{result.label}</p>
                <p className="text-titan-secondary text-sm">{result.advice}</p>
                <Button to="/programs" variant="secondary" className="mt-6">Explore Programs</Button>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            {[
              { range: '< 18.5', label: 'Underweight' },
              { range: '18.5 - 24.9', label: 'Normal' },
              { range: '25 - 29.9', label: 'Overweight' },
              { range: '30+', label: 'Obese' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-3">
                <p className="text-titan-red font-semibold">{item.range}</p>
                <p className="text-titan-muted text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
