import Sidebar from '../components/Sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'hsl(222,47%,5%)',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
      }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
