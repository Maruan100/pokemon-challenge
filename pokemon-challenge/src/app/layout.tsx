// filepath: /pokemon-challenge/pokemon-challenge/src/app/layout.tsx
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <h1>Pokedex</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2023 Pokedex. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;