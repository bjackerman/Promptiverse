
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Prompts from '@/pages/Prompts';

// Placeholder components
const Styles = () => <div className="p-4">Styles</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <nav className="border-b">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Link to="/" className="mr-6 flex items-center space-x-2 font-bold text-xl">
              PromptRepo
            </Link>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/prompts" className="hover:text-primary transition-colors">Prompts</Link>
              <Link to="/styles" className="hover:text-primary transition-colors">Styles</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prompts/*" element={<Prompts />} />
            <Route path="/styles/*" element={<Styles />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
