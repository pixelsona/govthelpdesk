import { useEffect, useState } from 'react';
import type { RouteId } from '@/data/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Home } from '@/pages/Home';
import { Helpdesk } from '@/pages/Helpdesk';
import { Departments } from '@/pages/Departments';
import { Processes } from '@/pages/Processes';
import { Documents } from '@/pages/Documents';
import { Requests } from '@/pages/Requests';
import { Notifications } from '@/pages/Notifications';
import { Profile } from '@/pages/Profile';

function App() {
  const [route, setRoute] = useState<RouteId>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  function navigate(id: RouteId) {
    setRoute(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar
        current={route}
        onNavigate={navigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="lg:pl-72">
        <Header
          current={route}
          onOpenMobile={() => setMobileOpen(true)}
          onNavigate={navigate}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {route === 'home' && <Home onNavigate={navigate} />}
          {route === 'helpdesk' && <Helpdesk />}
          {route === 'departments' && <Departments />}
          {route === 'processes' && <Processes />}
          {route === 'documents' && <Documents />}
          {route === 'requests' && <Requests />}
          {route === 'notifications' && <Notifications />}
          {route === 'profile' && <Profile onNavigate={navigate} />}
        </main>
      </div>
    </div>
  );
}

export default App;
