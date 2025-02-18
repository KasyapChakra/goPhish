import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentBundlePhishingPage from '../src/components/StudentBundlePhishingPage'
import MetricsDashboard from '../src/components/MetricsDashboard'
import InsuranceVerifyPhishingPage from '../src/components/InsuranceVerifyPhishingPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentBundlePhishingPage />} />
        <Route path="/insurance" element={<InsuranceVerifyPhishingPage />} />
        <Route path="/metrics" element={<MetricsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
